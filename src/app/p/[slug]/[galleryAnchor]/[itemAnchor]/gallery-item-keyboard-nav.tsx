"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { appendModeToPath } from "@/lib/routing/mode-query";

type GalleryItemKeyboardNavProps = {
  previousHref?: string;
  nextHref?: string;
};

export function GalleryItemKeyboardNav({
  previousHref,
  nextHref,
}: GalleryItemKeyboardNavProps) {
  const router = useRouter();
  const { mode } = useThemeModeFromDom({
    rootSelector: "main[data-theme][data-mode]",
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && previousHref) {
        event.preventDefault();
        router.push(appendModeToPath(previousHref, mode));
        return;
      }

      if (event.key === "ArrowRight" && nextHref) {
        event.preventDefault();
        router.push(appendModeToPath(nextHref, mode));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, nextHref, previousHref, router]);

  return null;
}
