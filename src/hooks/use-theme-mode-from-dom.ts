"use client";

import { useEffect, useState } from "react";

import { isThemeKey, type ThemeKey } from "@/lib/themes";
import { resolveModePreference, resolveThemePreference, type UiMode } from "@/lib/ui-preferences";

type ThemeModeState = {
  themeKey: ThemeKey;
  mode: UiMode;
};

type UseThemeModeFromDomOptions = {
  rootSelector?: string;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
};

function readThemeMode(
  rootSelector: string,
  fallbackThemeKey: ThemeKey,
  fallbackMode: UiMode
): ThemeModeState {
  if (typeof document === "undefined") {
    return {
      themeKey: fallbackThemeKey,
      mode: fallbackMode,
    };
  }

  const scope = document.querySelector(rootSelector) as HTMLElement | null;
  const themeCandidate = scope?.getAttribute("data-theme") ?? "";
  const rawMode = scope?.getAttribute("data-mode");

  return {
    themeKey: isThemeKey(themeCandidate) ? themeCandidate : fallbackThemeKey,
    mode: rawMode === "dark" || rawMode === "light" ? rawMode : fallbackMode,
  };
}

export function useThemeModeFromDom({
  rootSelector = "main[data-theme][data-mode]",
  fallbackThemeKey = resolveThemePreference(undefined),
  fallbackMode = resolveModePreference(undefined),
}: UseThemeModeFromDomOptions = {}) {
  const [state, setState] = useState<ThemeModeState>(() =>
    readThemeMode(rootSelector, fallbackThemeKey, fallbackMode)
  );

  useEffect(() => {
    const update = () => {
      setState(readThemeMode(rootSelector, fallbackThemeKey, fallbackMode));
    };

    update();

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.type === "attributes" &&
            (mutation.attributeName === "data-theme" || mutation.attributeName === "data-mode")
        )
      ) {
        update();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, [rootSelector, fallbackThemeKey, fallbackMode]);

  return state;
}
