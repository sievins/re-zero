"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { exampleTasksAtom, tasksAtom } from "~/lib/atoms";

const formSchema = z.object({
  task: z.string().min(1).max(280),
});

const maxChars = 280;

export function TaskForm() {
  const { user, isSignedIn } = useUser();

  const setExampleTasks = useSetAtom(exampleTasksAtom);
  const setTasks = useSetAtom(tasksAtom);

  const [charCount, setCharCount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  // Use form.watch to get the current value for enabling/disabling the submit button, without validating the form.
  const taskValue = form.watch("task");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setCharCount(inputText.length);
    form.setValue("task", inputText);
    form.clearErrors("task");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSignedIn) {
      // Optimistically update the UI
      setTasks((tasks) => [
        {
          id: 0, // PostgreSQL starts IDs at 1
          description: values.task,
          isOptimistic: true,
          createdAt: new Date(),
          marked: false,
          userId: user.id,
        },
        ...tasks,
      ]);

      createTask.mutate({
        description: values.task,
        userId: user?.id ?? "",
      });
    } else {
      setExampleTasks((exampleTasks) => [
        {
          id:
            exampleTasks.length > 0
              ? Math.max(...exampleTasks.map((t) => t.id)) + 1
              : 0,
          description: values.task,
          isOptimistic: false,
        },
        ...exampleTasks,
      ]);
      form.reset();
      setCharCount(0);
    }
  }

  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      form.reset();
      setCharCount(0);
      await utils.task.getAll.invalidate({ userId: user?.id ?? "" });
    },
    onError: (error) => {
      form.setError("task", { type: "server", message: error.message });
      // Remove optimistically added task from UI
      setTasks((tasks) => tasks.filter((task) => task.isOptimistic !== true));
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>Task</FormLabel>
                <FormControl>
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        maxLength={maxChars}
                        onChange={handleInputChange}
                        className="pr-[4.5rem] text-sm" // Add padding to the right to make space for the counter
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-muted-foreground/60">
                          {charCount}/{maxChars}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={!taskValue.trim() || createTask.isPending}
                      className="mt-2 w-32 sm:ml-2 sm:mt-0" // Make wide enough for loader icon to avoid content shift
                    >
                      {createTask.isPending && (
                        <Loader2 className="animate-spin" />
                      )}
                      Add task
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="pl-3" />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
