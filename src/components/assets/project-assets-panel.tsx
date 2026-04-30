"use client";

import { useState } from "react";
import type {
  ProjectAssetListItem,
  ProjectBackgroundSceneListItem,
} from "@/components/assets/types";
import { ImageAssetCard } from "@/components/assets/image-asset-card";
import { BackgroundSceneCard } from "@/components/assets/background-scene-card";
import { ImageAssetUploadCard } from "@/components/assets/image-asset-upload-card";

type ProjectAssetsPanelProps = {
  projectId: string;
  initialAssets: ProjectAssetListItem[];
  initialBackgroundScenes: ProjectBackgroundSceneListItem[];
  onAssetUploaded?: (asset: ProjectAssetListItem) => void;
  onAssetDeleted?: (assetId: string) => void;
};

export function ProjectAssetsPanel({
  projectId,
  initialAssets,
  initialBackgroundScenes,
  onAssetUploaded,
  onAssetDeleted,
}: ProjectAssetsPanelProps) {
  const [assets, setAssets] = useState(initialAssets);
  const backgroundScenes = initialBackgroundScenes;
  const [error, setError] = useState<string | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

  async function handleDeleteAsset(assetId: string) {
    setError(null);
    setDeletingAssetId(assetId);

    const response = await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as {
      deletedAssetId?: string;
      error?: string;
    };

    setDeletingAssetId(null);

    if (!response.ok || !payload.deletedAssetId) {
      setError(payload.error ?? "Deletion failed.");
      return;
    }

    setAssets((currentAssets) => currentAssets.filter((asset) => asset.id !== assetId));
    onAssetDeleted?.(assetId);
  }

  return (
    <section data-testid="ProjectAssetsPanel" className="py-6">

      <div className="mt-6 grid gap-4">
        <h3 className="text-base font-semibold text-text-main">Background catalog</h3>
        {backgroundScenes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
            No background scenes in catalog.
          </p>
        ) : (
          <div className="grid grid-cols-8 gap-4">
            {backgroundScenes.map((scene) => (
              <BackgroundSceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4">
        <h3 className="text-base font-semibold text-text-main">Image assets</h3>
        {error ? (
          <p className="rounded-2xl border border-danger-line bg-danger-100 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
        <div className="grid grid-cols-8 gap-4">
          <ImageAssetUploadCard
            projectId={projectId}
            onUploaded={(asset) => {
              setError(null);
              setAssets((currentAssets) => [asset, ...currentAssets]);
              onAssetUploaded?.(asset);
            }}
            onUploadError={(message) => setError(message)}
          />
          {assets.length === 0 ? (
            <p className="col-span-7 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
              No assets uploaded yet.
            </p>
          ) : (
            assets.map((asset) => (
              <ImageAssetCard
                key={asset.id}
                asset={asset}
                isDeleting={deletingAssetId === asset.id}
                onDelete={async (assetToDelete) => {
                  await handleDeleteAsset(assetToDelete.id);
                }}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
