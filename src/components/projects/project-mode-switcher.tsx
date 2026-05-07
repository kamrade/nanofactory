"use client";

import { useEffect, useRef, useState } from "react";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE } from "@/lib/ui-preferences";
import {
  enforceModeByPolicy,
  resolveProjectModePolicy,
  type ProjectModePolicy,
} from "@/lib/projects/mode-policy";

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
  policy?: ProjectModePolicy;
};

export function syncModeToUrl(paramName: string, mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(paramName, mode);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export function syncModeToCookie(mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${UI_MODE_COOKIE}=${mode}; path=/; max-age=${UI_COOKIE_MAX_AGE}; samesite=lax`;
}

export function ProjectModeSwitcher({
  initialMode,
  inputName,
  syncSearchParam,
  policy = "switchable",
}: ProjectModeSwitcherProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedPolicy = resolveProjectModePolicy(policy);
  const [mode, setMode] = useState<ThemeMode>(() =>
    enforceModeByPolicy(
      resolvedPolicy,
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
    )
  );

  function applyMode(nextMode: ThemeMode) {
    const enforcedMode = enforceModeByPolicy(resolvedPolicy, nextMode);
    if (enforcedMode === mode) {
      return;
    }
    setMode(enforcedMode);
    applyModeToRoot(containerRef.current, enforcedMode);
    syncModeToCookie(enforcedMode);
    if (syncSearchParam) {
      syncModeToUrl(syncSearchParam, enforcedMode);
    }
  }

  useEffect(() => {
    const enforcedMode = enforceModeByPolicy(resolvedPolicy, mode);
    if (enforcedMode !== mode) {
      setMode(enforcedMode);
      applyModeToRoot(containerRef.current, enforcedMode);
      syncModeToCookie(enforcedMode);
      if (syncSearchParam) {
        syncModeToUrl(syncSearchParam, enforcedMode);
      }
    }
  }, [mode, resolvedPolicy, syncSearchParam]);

  const options: Array<{ value: ThemeMode; label: string }> =
    resolvedPolicy === "switchable"
      ? [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]
      : resolvedPolicy === "dark-only"
        ? [{ value: "dark", label: "Dark" }]
        : [{ value: "light", label: "Light" }];

  return (
    <div ref={containerRef} data-testid="ProjectModeSwitcher">
      <UISegmentedControl
        ariaLabel="Project mode"
        size="sm"
        value={mode}
        onValueChange={applyMode}
        options={options}
      />
      {inputName ? <input type="hidden" name={inputName} value={mode} /> : null}
    </div>
  );
}
