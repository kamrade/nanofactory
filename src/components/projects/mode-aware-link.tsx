"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { appendModeToPath } from "@/lib/routing/mode-query";
import type { ThemeMode } from "@/lib/dom-utils";

type ModeAwareLinkProps = {
  href: string | null;
  children: ReactNode;
  fallbackMode?: ThemeMode;
} & Omit<ComponentProps<typeof Link>, "href" | "children">;

export function ModeAwareLink({
  href,
  children,
  fallbackMode = "light",
  ...linkProps
}: ModeAwareLinkProps) {
  const { mode } = useThemeModeFromDom({
    rootSelector: "main[data-theme][data-mode]",
    fallbackMode,
  });

  if (!href) {
    return children;
  }

  return (
    <Link
      href={appendModeToPath(href, mode)}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
