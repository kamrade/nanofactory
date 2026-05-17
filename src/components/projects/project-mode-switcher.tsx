"use client";

import { useEffect, useRef, useState } from "react";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { UI_COOKIE_MAX_AGE, UI_MODE_COOKIE } from "@/lib/ui-preferences";
import {
  enforceModeByPolicy,
  resolveProjectModePolicy,
  type ProjectModePolicy,
} from "@/lib/projects/mode-policy";
import {
  applyModeToRoot,
  readModeFromRoot,
  type ThemeMode,
} from "@/lib/dom-utils";

export type { ThemeMode };

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
  const { mode: domMode } = useThemeModeFromDom({
    rootSelector: "main[data-theme][data-mode]",
    fallbackMode: initialMode ?? "light",
  });
  const [mode, setMode] = useState<ThemeMode>(() =>
    enforceModeByPolicy(
      resolvedPolicy,
      initialMode ??
        (typeof document === "undefined"
          ? "light"
          : readModeFromRoot(document.querySelector("[data-theme]") as HTMLElement | null))
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

  useEffect(() => {
    const nextMode = enforceModeByPolicy(resolvedPolicy, initialMode ?? "light");
    setMode((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
    applyModeToRoot(containerRef.current, nextMode);
  }, [initialMode, resolvedPolicy]);

  useEffect(() => {
    const nextMode = enforceModeByPolicy(resolvedPolicy, domMode);
    setMode((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
  }, [domMode, resolvedPolicy]);

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
