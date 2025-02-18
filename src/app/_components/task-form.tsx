"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  task: z.string().min(1).max(280),
});

const maxChars = 280;

// TODO: Handle small screens
// TODO: Handle errors

export function TaskForm() {
  const user = useUser();

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
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTask.mutate({
      description: values.task,
      userId: user.user?.id ?? "",
    }); // TODO: handle not logged in
  }

  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      form.reset();
      setCharCount(0);
      await utils.task.invalidate();
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
                  <div className="flex">
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        maxLength={maxChars}
                        onChange={handleInputChange}
                        className="pr-[4.5rem]" // Add padding to the right to make space for the counter
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-muted-foreground md:text-sm">
                          {charCount}/{maxChars}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={!taskValue.trim() || createTask.isPending}
                      className="ml-2 w-32" // Make wide enough for loader icon to avoid content shift
                    >
                      {createTask.isPending && (
                        <Loader2 className="animate-spin" />
                      )}
                      Add task
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
