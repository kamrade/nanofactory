"use client";

import { FormEvent, useRef, useState } from "react";
import { UIButton } from "@/components/ui/button";
import { formatUiDateTime } from "@/lib/ui-date-time";
import type {
  ProjectAssetListItem,
  ProjectBackgroundSceneListItem,
} from "@/components/assets/types";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";

type ProjectAssetsPanelProps = {
  projectId: string;
  initialAssets: ProjectAssetListItem[];
  initialBackgroundScenes: ProjectBackgroundSceneListItem[];
  onAssetUploaded?: (asset: ProjectAssetListItem) => void;
};

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectAssetsPanel({
  projectId,
  initialAssets,
  initialBackgroundScenes,
  onAssetUploaded,
}: ProjectAssetsPanelProps) {
  const [assets, setAssets] = useState(initialAssets);
  const backgroundScenes = initialBackgroundScenes;
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a file before uploading.");
      return;
    }

    setIsUploading(true);

    const response = await fetch(`/api/projects/${projectId}/assets`, {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as {
      asset?: ProjectAssetListItem;
      error?: string;
    };

    setIsUploading(false);

    if (!response.ok || !payload.asset) {
      setError(payload.error ?? "Upload failed.");
      return;
    }

    setAssets((currentAssets) => [payload.asset!, ...currentAssets]);
    onAssetUploaded?.(payload.asset);
    setMessage(`Uploaded ${payload.asset.originalFilename}.`);
    formRef.current?.reset();
  }

  return (
    <section data-testid="ProjectAssetsPanel" className="py-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-text-main">Project assets</h2>
        <p className="text-sm leading-6 text-text-muted">
          Upload image files and use reusable background scenes from the global catalog.
          Image upload formats: JPEG, PNG, WEBP. Max size: 10 MB.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-line bg-surface-alt p-4"
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-text-main">Upload image</span>
            <input
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </label>

          {message ? (
            <p className="rounded-2xl border border-primary-line bg-primary-100 px-4 py-3 text-sm text-text-inverted-main">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-danger-line bg-danger-100 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <UIButton
            type="submit"
            disabled={isUploading}
            theme="primary"
            variant="contained"
            size="sm"
          >
            {isUploading ? "Uploading..." : "Upload asset"}
          </UIButton>
        </form>
      </div>

      <div className="mt-6 grid gap-4">
        <h3 className="text-base font-semibold text-text-main">Background catalog</h3>
        {backgroundScenes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
            No background scenes in catalog.
          </p>
        ) : (
          backgroundScenes.map((scene) => (
            <article
              key={scene.id}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
                  <div
                    className="aspect-[1200/630] w-full"
                    style={buildBackgroundSceneStyle(scene.sceneJson)}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-main">{scene.name}</h3>
                  <p className="text-sm text-text-placeholder">Scene ID: {scene.id}</p>
                  <p className="text-sm text-text-placeholder">
                    Layers: {scene.sceneJson.layers.length}
                  </p>
                  <p className="text-sm text-text-placeholder">
                    Canvas: {scene.sceneJson.canvas.width} x {scene.sceneJson.canvas.height}
                  </p>
                  <p className="text-sm text-text-placeholder">
                    Created: {formatUiDateTime(scene.createdAt)}
                  </p>
                  <p className="text-sm text-text-placeholder">
                    Updated: {formatUiDateTime(scene.updatedAt)}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 grid gap-4">
        <h3 className="text-base font-semibold text-text-main">Image assets</h3>
        {assets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
            No assets uploaded yet.
          </p>
        ) : (
          assets.map((asset) => (
            <article
              key={asset.id}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-text-main">
                    {asset.originalFilename}
                  </h3>
                  <p className="text-sm text-text-placeholder">Kind: {asset.kind}</p>
                  <p className="text-sm text-text-placeholder">Type: {asset.mimeType}</p>
                  <p className="text-sm text-text-placeholder">
                    Size: {formatFileSize(asset.sizeBytes)}
                  </p>
                  <p className="break-all text-sm text-text-placeholder">
                    Storage key: {asset.storageKey}
                  </p>
                  <p className="text-sm text-text-placeholder">
                    Created: {formatUiDateTime(asset.createdAt)}
                  </p>
                  <p className="text-sm text-text-placeholder">
                    Updated: {formatUiDateTime(asset.updatedAt)}
                  </p>
                </div>

                <UIButton asChild theme="base" variant="outlined" size="sm">
                  <a href={asset.publicUrl} target="_blank" rel="noreferrer">
                    Open file
                  </a>
                </UIButton>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
