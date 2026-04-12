"use client";

import { useRef, useState } from "react";
import { UIButton } from "@/components/ui/button";

type ThemeMode = "light" | "dark";

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

type ClosestCapableNode = {
  closest: (selector: string) => {
    setAttribute: (name: string, value: string) => void;
    getAttribute?: (name: string) => string | null;
  } | null;
};

export function readModeFromRoot(node: ClosestCapableNode | null | undefined): ThemeMode {
  const rootMode = node?.closest("main[data-theme]")?.getAttribute?.("data-mode");
  return isThemeMode(rootMode) ? rootMode : "light";
}

export function applyModeToRoot(node: ClosestCapableNode | null | undefined, mode: ThemeMode) {
  node?.closest("main[data-theme]")?.setAttribute("data-mode", mode);
}

export function ProjectModeSwitcher() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(() =>
    typeof document === "undefined"
      ? "light"
      : readModeFromRoot({
          closest: (selector) =>
            document.querySelector(selector) as {
              setAttribute: (name: string, value: string) => void;
              getAttribute: (name: string) => string | null;
            } | null,
        })
  );

  function applyMode(nextMode: ThemeMode) {
    setMode(nextMode);
    applyModeToRoot(containerRef.current, nextMode);
  }

  return (
    <div ref={containerRef} className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
      <UIButton
        type="button"
        onClick={() => applyMode("light")}
        aria-pressed={mode === "light"}
        className={
          mode === "light"
            ? "rounded-lg bg-primary-300 px-3 py-1 text-xs font-medium text-text-inverted-main"
            : "rounded-lg px-3 py-1 text-xs font-medium text-text-muted hover:bg-surface-alt"
        }
      >
        Light
      </UIButton>
      <UIButton
        type="button"
        onClick={() => applyMode("dark")}
        aria-pressed={mode === "dark"}
        className={
          mode === "dark"
            ? "rounded-lg bg-primary-300 px-3 py-1 text-xs font-medium text-text-inverted-main"
            : "rounded-lg px-3 py-1 text-xs font-medium text-text-muted hover:bg-surface-alt"
        }
      >
        Dark
      </UIButton>
    </div>
  );
}
