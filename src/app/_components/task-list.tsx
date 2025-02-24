"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useUser } from "@clerk/nextjs";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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

  /***** Getting the tasks *****/

  const [tasksFromApi] = api.task.getAll.useSuspenseQuery({
    userId: user?.id ?? "",
  });

  const [exampleTasks, setExampleTasks] = useAtom(exampleTasksAtom);
  const [userTasks, setUserTasks] = useAtom(tasksAtom);

  // Store tasks from tRPC in store. The store is the source of truth so we can utilise optimistic updates.
  useEffect(() => {
    if (isSignedIn) {
      setUserTasks(tasksFromApi);
    }
  }, [isSignedIn, tasksFromApi, setUserTasks]);

  const tasks: typeof userTasks | typeof exampleTasks = isSignedIn
    ? userTasks
    : exampleTasks;

  /***** Marking a task *****/

  const [markedTasks, setMarkedTasks] = useState<number[]>([]);

  const mark = (id: number) => {
    const isMarked = markedTasks.includes(id);
    if (isMarked) {
      setMarkedTasks(markedTasks.filter((item) => item !== id));
    } else {
      setMarkedTasks([...markedTasks, id]);
    }
  };

  /***** Deleting a task *****/

  const [deleteErrorTasks, setDeleteErrorTasks] = useState<number[]>([]);
  const taskIdToTimeoutId = useRef<Record<number, NodeJS.Timeout>>({});

  const utils = api.useUtils();

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate({ userId: user?.id ?? "" });
    },
    onError: async (_error, variables) => {
      // Refetch tasks from the API to revert the optimistic update (assumes getAll is still working)
      // Note: Faster than invalidating
      const tasks = await utils.task.getAll.fetch({ userId: user?.id ?? "" });
      setUserTasks(tasks);

      // Save tasks that failed to delete so a message can appear on them
      clearTimeout(taskIdToTimeoutId.current[variables.taskId]);
      setDeleteErrorTasks((prev) => [...prev, variables.taskId]);
      const timeoutId = setTimeout(() => {
        setDeleteErrorTasks((prev) =>
          prev.filter((id) => id !== variables.taskId),
        );
      }, 3000); // Display the error message for 3 seconds
      taskIdToTimeoutId.current[variables.taskId] = timeoutId;
    },
  });

  const handleChecked = (id: number) => {
    if (isSignedIn) {
      // Optimistically remove the task from the UI
      setUserTasks(userTasks.filter((task) => task.id !== id));
      deleteTask.mutate({ userId: user.id, taskId: id });
    } else {
      setExampleTasks(exampleTasks.filter((task) => task.id !== id));
    }
  };

  /***** Animations *****/

  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="min-w-[18rem] space-y-2 sm:min-w-[32rem]">
      {tasks.map((item, index) => (
        <div key={item.key}>
          <div
            className={cn(
              "flex w-[18rem] items-center rounded-md p-2 transition-colors sm:w-[32rem]",
              markedTasks.includes(item.id) && "bg-primary/40",
            )}
          >
            <Checkbox
              id={`${item.id}`}
              disabled={Boolean(item.isOptimistic)}
              onCheckedChange={() => handleChecked(item.id)}
            />
            <label
              htmlFor={`${item.id}`}
              className={cn(
                "ml-2 max-w-sm text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                !isSignedIn && item.key === "1" && "text-destructive",
              )}
            >
              {item.description}
              {deleteErrorTasks.includes(item.id) && (
                <span className="text-destructive"> (Failed to delete)</span>
              )}
            </label>
            <button
              onClick={() => mark(item.id)}
              className="ml-auto text-sm text-primary hover:underline focus:outline-none"
              disabled={Boolean(item.isOptimistic)}
            >
              {markedTasks.includes(item.id) ? "Unmark" : "Mark"}
            </button>
          </div>
          {index < tasks.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}
