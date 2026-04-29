"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import { isThemeKey, type ThemeKey } from "@/lib/themes";
import { resolveModePreference, resolveThemePreference, type UiMode } from "@/lib/ui-preferences";

type BackgroundRendererProps = {
  scene: BackgroundScene;
};

export function BackgroundRenderer({ scene }: BackgroundRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeThemeMode, setActiveThemeMode] = useState<{
    themeKey: ThemeKey;
    mode: UiMode;
  }>({
    themeKey: resolveThemePreference(undefined),
    mode: resolveModePreference(undefined),
  });

  useEffect(() => {
    const main = containerRef.current?.closest("main[data-theme][data-mode]") as HTMLElement | null;

    const readThemeMode = () => {
      const rawTheme = main?.getAttribute("data-theme");
      const rawMode = main?.getAttribute("data-mode");

      setActiveThemeMode({
        themeKey: isThemeKey(rawTheme ?? "") ? rawTheme : resolveThemePreference(undefined),
        mode: rawMode === "dark" || rawMode === "light" ? rawMode : resolveModePreference(undefined),
      });
    };

    readThemeMode();

    if (!main) {
      return;
    }

    const observer = new MutationObserver(() => {
      readThemeMode();
    });
    observer.observe(main, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, []);

  const themedScene = useMemo(
    () => remapSceneToPalette(scene, activeThemeMode),
    [scene, activeThemeMode]
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={buildBackgroundSceneStyle(themedScene)}
    />
  );
}
