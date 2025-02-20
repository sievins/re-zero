"use client";

import { Suspense, useState } from "react";
import { useAtomValue } from "jotai";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { exampleTasksAtom } from "~/lib/atoms";

const skeleton = (
  <div className="space-y-[calc(1rem+1px)]">
    {/* +1px to take into account the separator */}
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
    <Skeleton className="h-9 w-[18rem] bg-primary/40 sm:w-[32rem]" />
  </div>
);

export function TaskList() {
  const { isLoaded } = useUser();
  if (!isLoaded) {
    return skeleton;
  }
  return (
    <Suspense fallback={skeleton}>
      <TaskListContent />
    </Suspense>
  );
}

function TaskListContent() {
  const { isSignedIn, user } = useUser();
  // TODO: Handle error
  const [tasksFromApi] = api.task.getAll.useSuspenseQuery({
    userId: user?.id ?? "",
  });

  const exampleTasks = useAtomValue(exampleTasksAtom);

  const [highlightedItems, setHighlightedItems] = useState<number[]>([]);

  const handleHighlight = (id: number) => {
    const isHighlighted = highlightedItems.includes(id);
    if (isHighlighted) {
      setHighlightedItems(highlightedItems.filter((item) => item !== id));
    } else {
      setHighlightedItems([...highlightedItems, id]);
    }
  };

  const tasks = isSignedIn ? tasksFromApi : exampleTasks;

  return (
    <div className="space-y-2">
      {tasks.map((item, index) => (
        <div key={item.id}>
          <div
            className={cn(
              "flex w-[18rem] items-center rounded-md p-2 transition-colors sm:w-[32rem]",
              highlightedItems.includes(item.id) ? "bg-primary/40" : "",
            )}
          >
            <Checkbox id={`${item.id}`} />
            <label
              htmlFor={`${item.id}`}
              className="ml-2 max-w-sm text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.description}
            </label>
            <button
              onClick={() => handleHighlight(item.id)}
              className="ml-auto text-sm text-primary hover:underline focus:outline-none"
            >
              Mark
            </button>
          </div>
          {index < tasks.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}
