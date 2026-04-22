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

export type ProjectBackgroundSceneListItem = {
  id: string;
  projectId: string;
  name: string;
  sceneJson: import("@/lib/background-scenes/types").BackgroundScene;
  createdAt: string;
  updatedAt: string;
};
