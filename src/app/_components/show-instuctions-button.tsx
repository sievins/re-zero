"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getCookie, setCookie } from "~/lib/actions/cookie";
import { cookieNames } from "~/lib/actions/cookie-names";

export function ShowIntructionsButton() {
  const [parent] = useAutoAnimate();

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
    // "min-w-40" required to prevent annimation jumping around when inside flex
    // https://github.com/formkit/auto-animate/issues/182#issuecomment-2358393967
    <div ref={parent} className="min-w-40">
      {isShowButtonVisible && (
        <Button
          variant="outline"
          onClick={() => setCookie(cookieNames.showInstructions, "true")}
          className="min-w-40"
        >
          Show instructions
        </Button>
      )}
    </div>
  );
}
