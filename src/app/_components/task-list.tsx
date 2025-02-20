"use client";

import { Suspense, useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useUser } from "@clerk/nextjs";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { cn } from "~/lib/utils";
import { exampleTasksAtom, tasksAtom } from "~/lib/atoms";

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

function Fallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="!top-[unset] h-6 w-6" />
      <AlertTitle className="mb-2 text-base">Failed to load tasks</AlertTitle>
      <AlertDescription>
        <Button onClick={resetErrorBoundary} variant="outline">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function TaskList() {
  const utils = api.useUtils();
  const { isLoaded, user } = useUser();
  if (!isLoaded) {
    return skeleton;
  }
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={async () => {
        // Invalidate the failing query and clear error cache so it refetches on re-render.
        await utils.task.getAll.reset({ userId: user?.id ?? "" });
      }}
    >
      <Suspense fallback={skeleton}>
        <TaskListContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function TaskListContent() {
  const { isSignedIn, user } = useUser();
  const [tasksFromApi] = api.task.getAll.useSuspenseQuery({
    userId: user?.id ?? "",
  });

  const exampleTasks = useAtomValue(exampleTasksAtom);
  const [userTasks, setUserTasks] = useAtom(tasksAtom);

  // Store tasks from tRPC in store. The store is the source of truth so we can utilise optimistic updates.
  useEffect(() => {
    if (isSignedIn) {
      setUserTasks(tasksFromApi);
    }
  }, [isSignedIn, tasksFromApi, setUserTasks]);

  const [highlightedItems, setHighlightedItems] = useState<number[]>([]);

  const handleHighlight = (id: number) => {
    const isHighlighted = highlightedItems.includes(id);
    if (isHighlighted) {
      setHighlightedItems(highlightedItems.filter((item) => item !== id));
    } else {
      setHighlightedItems([...highlightedItems, id]);
    }
  };

  const tasks: typeof userTasks | typeof exampleTasks = isSignedIn
    ? userTasks
    : exampleTasks;

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
            <Checkbox id={`${item.id}`} disabled={Boolean(item.isOptimistic)} />
            <label
              htmlFor={`${item.id}`}
              className="ml-2 max-w-sm text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.description}
            </label>
            <button
              onClick={() => handleHighlight(item.id)}
              className="ml-auto text-sm text-primary hover:underline focus:outline-none"
              disabled={Boolean(item.isOptimistic)}
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
