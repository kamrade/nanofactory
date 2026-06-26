"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { appendModeToPath } from "@/lib/routing/mode-query";
import type { ThemeMode } from "@/lib/dom-utils";

type ModeAwareLinkProps = {
  href: string | null;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
  fallbackMode?: ThemeMode;
};

export function ModeAwareLink({
  href,
  children,
  className,
  ariaLabel,
  title,
  fallbackMode = "light",
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
      className={className}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </Link>
  );
}
