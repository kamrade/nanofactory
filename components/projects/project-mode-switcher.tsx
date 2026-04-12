"use client";

import { useRef, useState } from "react";
import { UISegmentedControl } from "@/components/ui/segmented-control";

export type ThemeMode = "light" | "dark";

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

type ProjectModeSwitcherProps = {
  initialMode?: ThemeMode;
  inputName?: string;
  syncSearchParam?: string;
};

function syncModeToUrl(paramName: string, mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(paramName, mode);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export function ProjectModeSwitcher({
  initialMode,
  inputName,
  syncSearchParam,
}: ProjectModeSwitcherProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(() =>
    initialMode ??
    (typeof document === "undefined"
      ? "light"
      : readModeFromRoot({
          closest: (selector) =>
            document.querySelector(selector) as {
              setAttribute: (name: string, value: string) => void;
              getAttribute: (name: string) => string | null;
            } | null,
        }))
  );

  function applyMode(nextMode: ThemeMode) {
    setMode(nextMode);
    applyModeToRoot(containerRef.current, nextMode);
    if (syncSearchParam) {
      syncModeToUrl(syncSearchParam, nextMode);
    }
  }

  return (
    <div ref={containerRef}>
      <UISegmentedControl
        ariaLabel="Project mode"
        size="sm"
        value={mode}
        onValueChange={applyMode}
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
      {inputName ? <input type="hidden" name={inputName} value={mode} /> : null}
    </div>
  );
}
