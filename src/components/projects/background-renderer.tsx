"use client";

import { useMemo } from "react";

import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundScene } from "@/lib/background-scenes/types";

type BackgroundRendererProps = {
  scene: BackgroundScene;
};

export function BackgroundRenderer({ scene }: BackgroundRendererProps) {
  const activeThemeMode = useThemeModeFromDom({
    rootSelector: "main[data-theme][data-mode]",
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
