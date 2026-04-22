"use client";

export type ProjectAssetListItem = {
  id: string;
  projectId: string;
  kind: "image";
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type BackgroundSceneListItem = {
  id: string;
  projectId: string | null;
  name: string;
  sceneJson: import("@/lib/background-scenes/types").BackgroundScene;
  createdByUserId?: string | null;
  sourceProjectId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectBackgroundSceneListItem = BackgroundSceneListItem;
