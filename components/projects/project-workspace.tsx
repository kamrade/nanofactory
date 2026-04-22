"use client";

import { useMemo, useState } from "react";

import { ProjectAssetsPanel } from "@/components/assets/project-assets-panel";
import type {
  ProjectAssetListItem,
  ProjectBackgroundSceneListItem,
} from "@/components/assets/types";
import { ProjectEditor } from "@/components/editor/project-editor";
import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";

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
  initialAssets,
  initialBackgroundScenes,
}: ProjectWorkspaceProps) {
  const [assets, setAssets] = useState<ProjectAssetRecord[]>(initialAssets);
  const [backgroundScenes, setBackgroundScenes] =
    useState<BackgroundSceneRecord[]>(initialBackgroundScenes);

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
        onBackgroundSceneCreated={(scene) => {
          setBackgroundScenes((current) => [
            {
              ...scene,
              createdAt: new Date(scene.createdAt),
              updatedAt: new Date(scene.updatedAt),
            },
            ...current,
          ]);
        }}
      />
    </>
  );
}
