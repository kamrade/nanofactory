"use client";

import type { ReactNode } from "react";

import { UIToastProvider } from "@/components/ui/toast-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <UIToastProvider>{children}</UIToastProvider>;
}

