"use client";

import { Button } from "~/components/ui/button";
import { setCookie } from "~/lib/actions/cookie";
import { cookieNames } from "~/lib/actions/cookie-names";
import { X } from "lucide-react";

export function InstructionsDismissButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute right-2 top-2 h-8 w-8"
      onClick={() => setCookie(cookieNames.showInstructions, "false")}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </Button>
  );
}
