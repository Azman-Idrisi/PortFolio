"use client";

import { ThemeProvider } from "@/app/provider";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import Intro from "@/components/Intro";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <FollowerPointerCard
        className="min-h-screen w-full"
        title="Azman's Portfolio"
      >
        <Intro />
        {children}
      </FollowerPointerCard>
    </ThemeProvider>
  );
}
