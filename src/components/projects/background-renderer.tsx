"use client";

import { useMemo } from "react";

import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type BackgroundRendererProps = {
  scene: BackgroundScene;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
};

export function BackgroundRenderer({
  scene,
  fallbackThemeKey,
  fallbackMode,
}: BackgroundRendererProps) {
  const activeThemeMode = useThemeModeFromDom({
    rootSelector: "main[data-theme][data-mode]",
    fallbackThemeKey,
    fallbackMode,
  });

  const themedScene = useMemo(
    () => remapSceneToPalette(scene, activeThemeMode),
    [scene, activeThemeMode]
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={buildBackgroundSceneStyle(themedScene)}
    />
  );
}
