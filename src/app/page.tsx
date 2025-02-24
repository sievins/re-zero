import {
  SignedOut,
  SignInButton,
  SignOutButton,
  SignedIn,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { HydrateClient, api } from "~/trpc/server";
import { Instructions } from "~/app/_components/instructions";
import { TaskList } from "~/app/_components/task-list";
import { TaskForm } from "~/app/_components/task-form";
import { ShowIntructionsButton } from "~/app/_components/show-instuctions-button";

export default async function Home() {
  const user = await currentUser();
  void api.task.getAll.prefetch({ userId: user?.id ?? "" });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#f7fafd] to-[#ebf2fa]">
        {/* Authentication */}
        <div className="my-4 mr-8 flex w-screen justify-end space-x-2">
          <ShowIntructionsButton />
          <SignedOut>
            <SignInButton>
              <Button>
                <LogIn /> Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <Button variant="outline">
                <LogOut /> Sign out
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
        <div className="container flex flex-col items-center justify-center gap-10 px-4 pb-16 pt-4 sm:gap-16 sm:pt-16">
          {/* Main content */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Re: <span className="text-primary">Zero</span>
            </h1>
            <h2 className="text-l font-bold tracking-tight sm:text-xl">
              Complete tasks with zero resistance
            </h2>
          </div>
          <div className="flex w-full flex-col items-center gap-8">
            <Instructions />
            <TaskForm />
            <TaskList />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
