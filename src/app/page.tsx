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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "hidden sm:flex",
                  )}
                  href="https://github.com/sievins/re-zero"
                  target="_blank"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>See how this was built</p>
              </TooltipContent>
            </Tooltip>
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
