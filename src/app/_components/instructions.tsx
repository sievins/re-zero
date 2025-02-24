import { cookies } from "next/headers";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { cookieNames } from "~/lib/actions/cookie-names";
import { RotateCcw } from "lucide-react";
import { InstructionsDismissButton } from "./instructions-dismiss-button";

const Step = ({ number, text }: { number: number; text: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
      {number}
    </div>
    <p className="max-w-[200px] text-sm font-bold">{text}</p>
  </div>
);

export async function Instructions() {
  // Use cookies instead of local storage to avoid content shift when the client hydrates
  const cookieStore = await cookies();
  const shouldShowInstructions =
    cookieStore.get(cookieNames.showInstructions)?.value !== "false";

  return (
    <Card
      className={cn(
        "relative w-full max-w-4xl",
        // Animations (can't use @formkit/auto-animate/react in server component)
        "overflow-hidden transition-all duration-300 ease-in-out",
        shouldShowInstructions
          ? "max-h-72 opacity-100 sm:max-h-64"
          : "-mt-8 max-h-0 border-0 opacity-0", // "-mt-8" remove gap when element is hidden
      )}
    >
      <InstructionsDismissButton />
      <CardContent className="px-10 py-6 sm:px-6">
        <div className="mb-8 hidden items-start justify-between sm:flex">
          <Step number={1} text="Quickly scan all the tasks (no skipping)" />
          <Step
            number={2}
            text="Mark tasks you feel absolutely no resistance to doing"
          />
          <Step number={3} text="Do something on every marked task" />
        </div>
        <div className="hidden flex-col items-center sm:flex">
          <RotateCcw className="mb-2 h-8 w-8 text-primary" />
          <span className="text-sm font-bold">Repeat</span>
        </div>
        <ol className="block list-decimal text-sm font-bold leading-7 sm:hidden">
          <li>Quickly scan all the tasks (no skipping)</li>
          <li>Mark tasks you feel absolutely no resistance to doing</li>
          <li>Do something on every marked task</li>
          <li>Repeat</li>
        </ol>
      </CardContent>
    </Card>
  );
}
