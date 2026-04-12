"use client";

import { FormEvent, useRef, useState } from "react";
import { UIButton } from "@/components/ui/button";

type AssetListItem = {
  id: string;
  projectId: string;
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

type ProjectAssetsPanelProps = {
  projectId: string;
  initialAssets: AssetListItem[];
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
}: ProjectAssetsPanelProps) {
  const [assets, setAssets] = useState(initialAssets);
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
      asset?: AssetListItem;
      error?: string;
    };

    setIsUploading(false);

    if (!response.ok || !payload.asset) {
      setError(payload.error ?? "Upload failed.");
      return;
    }

    setAssets((currentAssets) => [payload.asset!, ...currentAssets]);
    setMessage(`Uploaded ${payload.asset.originalFilename}.`);
    formRef.current?.reset();
  }

  return (
    <section data-testid="ProjectAssetsPanel" className="py-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-text-main">Project assets</h2>
        <p className="text-sm leading-6 text-text-muted">
          Technical upload panel for project-scoped assets. Allowed formats: JPEG,
          PNG, WEBP. Max size: 10 MB.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-5 grid gap-4 rounded-2xl border border-line bg-surface-alt p-4"
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

      <div className="mt-6 grid gap-4">
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
                  <p className="text-sm text-text-placeholder">Type: {asset.mimeType}</p>
                  <p className="text-sm text-text-placeholder">
                    Size: {formatFileSize(asset.sizeBytes)}
                  </p>
                  <p className="break-all text-sm text-text-placeholder">
                    Storage key: {asset.storageKey}
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
