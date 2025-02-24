"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getCookie, setCookie } from "~/lib/actions/cookie";
import { cookieNames } from "~/lib/actions/cookie-names";
import { cn } from "~/lib/utils";

export function ShowIntructionsButton() {
  const [isShowButtonVisible, setIsShowButtonVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const shouldShowIntructions = await getCookie(
        cookieNames.showInstructions,
      );
      setIsShowButtonVisible(shouldShowIntructions === "false");
    })();
  });

  return (
    <Button
      variant="outline"
      className={cn(!isShowButtonVisible && "hidden")}
      onClick={() => setCookie(cookieNames.showInstructions, "true")}
    >
      Show instructions
    </Button>
  );
}
