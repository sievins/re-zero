import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { HydrateClient } from "~/trpc/server";
import { TaskList } from "~/app/_components/task-list";
import { TaskForm } from "~/app/_components/task-form";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f7fafd] to-[#ebf2fa]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Main content */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Re: <span className="text-primary">Zero</span>
          </h1>
          <h2 className="text-xl font-extrabold tracking-tight sm:text-[1.3rem]">
            Complete tasks with zero resistance
          </h2>
          <TaskForm />
          <TaskList />
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
