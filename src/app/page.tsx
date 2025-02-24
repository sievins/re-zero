import {
  SignedOut,
  SignInButton,
  SignOutButton,
  SignedIn,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ExternalLink, LogIn, LogOut } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { HydrateClient, api } from "~/trpc/server";
import { Instructions } from "~/app/_components/instructions";
import { TaskList } from "~/app/_components/task-list";
import { TaskForm } from "~/app/_components/task-form";
import { ShowIntructionsButton } from "~/app/_components/show-instuctions-button";
import { cn } from "~/lib/utils";

export default async function Home() {
  const user = await currentUser();
  void api.task.getAll.prefetch({ userId: user?.id ?? "" });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#f7fafd] to-[#ebf2fa]">
        {/* Buttons in header */}
        <div className="my-4 flex w-screen justify-end px-4 sm:justify-between">
          {/* Buttons on left */}
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "hidden px-0 sm:flex",
            )}
            href="http://markforster.squarespace.com/blog/2022/6/14/resistance-how-to-make-the-most-of-it-the-resistance-zero-sy.html"
            target="_blank"
          >
            System designed by Mark Forster <ExternalLink />
          </Link>
          {/* Buttons on right */}
          <div className="flex space-x-4">
            <ShowIntructionsButton />
            {/* Authentication */}
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
        </div>
        {/* Main content */}
        <div className="container flex flex-col items-center justify-center gap-10 px-4 pb-16 pt-4 sm:gap-16 sm:pt-16">
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
