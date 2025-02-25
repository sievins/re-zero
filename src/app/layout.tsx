import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { PostHogProvider } from "~/lib/providers/posthog-provider";

export const metadata: Metadata = {
  title: "Re: Zero",
  description: "Complete tasks with zero resistance",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ClerkProvider>
            <PostHogProvider>{children}</PostHogProvider>
          </ClerkProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
