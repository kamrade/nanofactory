"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type GalleryItemKeyboardNavProps = {
  previousHref?: string;
  nextHref?: string;
};

export function GalleryItemKeyboardNav({
  previousHref,
  nextHref,
}: GalleryItemKeyboardNavProps) {
  const router = useRouter();

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
        router.push(previousHref);
        return;
      }

      if (event.key === "ArrowRight" && nextHref) {
        event.preventDefault();
        router.push(nextHref);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextHref, previousHref, router]);

  return null;
}

