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
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-950">Project assets</h2>
        <p className="text-sm leading-6 text-zinc-600">
          Technical upload panel for project-scoped assets. Allowed formats: JPEG,
          PNG, WEBP. Max size: 10 MB.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-5 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
      >
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Upload image</span>
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
        </label>

        {message ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <UIButton
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isUploading ? "Uploading..." : "Upload asset"}
        </UIButton>
      </form>

      <div className="mt-6 grid gap-4">
        {assets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-500">
            No assets uploaded yet.
          </p>
        ) : (
          assets.map((asset) => (
            <article
              key={asset.id}
              className="rounded-2xl border border-zinc-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-zinc-950">
                    {asset.originalFilename}
                  </h3>
                  <p className="text-sm text-zinc-600">Type: {asset.mimeType}</p>
                  <p className="text-sm text-zinc-600">
                    Size: {formatFileSize(asset.sizeBytes)}
                  </p>
                  <p className="break-all text-sm text-zinc-600">
                    Storage key: {asset.storageKey}
                  </p>
                </div>

                <a
                  href={asset.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  Open file
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
