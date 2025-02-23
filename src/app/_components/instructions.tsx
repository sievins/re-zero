"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RotateCcw, X } from "lucide-react";

const Step = ({ number, text }: { number: number; text: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
      {number}
    </div>
    <p className="max-w-[200px] text-sm font-bold">{text}</p>
  </div>
);

export function Instructions() {
  return (
    <Card className="relative w-full max-w-4xl">
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={() => console.log("close")}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
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
