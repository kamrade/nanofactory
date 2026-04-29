"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectAssetsPanel } from "@/components/assets/project-assets-panel";
import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import type {
  ProjectAssetListItem,
  ProjectBackgroundSceneListItem,
} from "@/components/assets/types";
import { ProjectEditor } from "@/components/editor/project-editor";
import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { isThemeKey, type ThemeKey } from "@/lib/themes";
import { resolveModePreference, resolveThemePreference, type UiMode } from "@/lib/ui-preferences";

type EditorProject = {
  id: string;
  name: string;
  slug: string;
  themeKey: string;
  status: "draft" | "published";
  contentJson: PageContent;
};

type ProjectWorkspaceProps = {
  project: EditorProject;
  initialMode: UiMode;
  initialAssets: ProjectAssetRecord[];
  initialBackgroundScenes: BackgroundSceneRecord[];
};

function toAssetListItem(asset: ProjectAssetRecord): ProjectAssetListItem {
  return {
    ...asset,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

function toBackgroundSceneListItem(scene: BackgroundSceneRecord): ProjectBackgroundSceneListItem {
  return {
    ...scene,
    createdAt: scene.createdAt.toISOString(),
    updatedAt: scene.updatedAt.toISOString(),
  };
}

export function ProjectWorkspace({
  project,
  initialMode,
  initialAssets,
  initialBackgroundScenes,
}: ProjectWorkspaceProps) {
  const [assets, setAssets] = useState<ProjectAssetRecord[]>(initialAssets);
  const [activeThemeMode, setActiveThemeMode] = useState<{
    themeKey: ThemeKey;
    mode: UiMode;
  }>({
    themeKey: resolveThemePreference(project.themeKey),
    mode: resolveModePreference(initialMode),
  });

  useEffect(() => {
    const readThemeMode = () => {
      const scopedMain = document.querySelector("main[data-theme][data-mode]") as HTMLElement | null;
      const rawTheme = scopedMain?.getAttribute("data-theme");
      const rawMode = scopedMain?.getAttribute("data-mode");

      setActiveThemeMode({
        themeKey: isThemeKey(rawTheme ?? "")
          ? rawTheme
          : resolveThemePreference(project.themeKey),
        mode: rawMode === "dark" || rawMode === "light" ? rawMode : resolveModePreference(initialMode),
      });
    };

    readThemeMode();

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.type === "attributes" &&
            (mutation.attributeName === "data-theme" || mutation.attributeName === "data-mode")
        )
      ) {
        readThemeMode();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, [project.themeKey, initialMode]);

  const backgroundScenes = useMemo(
    () =>
      initialBackgroundScenes.map((scene) => ({
        ...scene,
        sceneJson: remapSceneToPalette(scene.sceneJson, activeThemeMode),
      })),
    [initialBackgroundScenes, activeThemeMode]
  );

  const assetListItems = useMemo(() => assets.map(toAssetListItem), [assets]);
  const sceneListItems = useMemo(
    () => backgroundScenes.map(toBackgroundSceneListItem),
    [backgroundScenes]
  );

  return (
    <>
      <ProjectEditor
        project={project}
        assets={assets}
        backgroundScenes={backgroundScenes}
      />

      <ProjectAssetsPanel
        projectId={project.id}
        initialAssets={assetListItems}
        initialBackgroundScenes={sceneListItems}
        onAssetUploaded={(asset) => {
          setAssets((current) => [
            {
              ...asset,
              createdAt: new Date(asset.createdAt),
              updatedAt: new Date(asset.updatedAt),
            },
            ...current,
          ]);
        }}
      />
    </>
  );
}
