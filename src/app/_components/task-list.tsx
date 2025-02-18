"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface Task {
  id: number;
  description: string;
}

const exampleTasks: Task[] = [
  { id: 1, description: "Car insurance" },
  { id: 2, description: "Invite Sarah for dinner" },
  { id: 3, description: "Email documents to John" },
  { id: 4, description: "Read book" },
  { id: 5, description: "Create exercise routine" },
  { id: 6, description: "Finish project" },
];

export function TaskList() {
  const { isLoaded } = useUser();
  if (!isLoaded) {
    // TODO: Skeleton loader and content shift
    return null;
  }
  return <TaskListContent />;
}

function TaskListContent() {
  const { isSignedIn, user } = useUser();
  // TODO: Handle error
  const [tasksFromApi, taskQuery] = api.task.getAll.useSuspenseQuery({
    userId: user?.id ?? "",
  });

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
