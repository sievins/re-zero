import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { HydrateClient } from "~/trpc/server";
import { TaskList } from "~/app/_components/task-list";
import { TaskForm } from "~/app/_components/task-form";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f7fafd] to-[#ebf2fa]">
        <div className="container flex flex-col items-center justify-center gap-10 px-4 py-16 sm:gap-16">
          {/* Main content */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Re: <span className="text-primary">Zero</span>
            </h1>
            <h2 className="text-l font-bold tracking-tight sm:text-xl">
              Complete tasks with zero resistance
            </h2>
          </div>
          <div className="flex flex-col items-center gap-8">
            <TaskForm />
            <TaskList />
          </div>
          {/* Authentication */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </main>
    </HydrateClient>
  );
}
