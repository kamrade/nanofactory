"use client";

import { FormEvent, useRef, useState } from "react";

import type { ProjectAssetListItem } from "@/components/assets/types";
import { UIButton } from "@/components/ui/button";
import { UIModal } from "@/components/ui/modal";

type ImageAssetUploadCardProps = {
  projectId: string;
  onUploaded: (asset: ProjectAssetListItem) => void;
  onUploadError?: (message: string) => void;
};

export function ImageAssetUploadCard({
  projectId,
  onUploaded,
  onUploadError,
}: ImageAssetUploadCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      const nextError = "Choose a file before uploading.";
      setError(nextError);
      onUploadError?.(nextError);
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
      const nextError = payload.error ?? "Upload failed.";
      setError(nextError);
      onUploadError?.(nextError);
      return;
    }

    onUploaded(payload.asset);
    setMessage(`Uploaded ${payload.asset.originalFilename}.`);
    formRef.current?.reset();
  }

  return (
    <UIModal
      size="md"
      title="Upload image"
      description="Image upload formats: JPEG, PNG, WEBP. Max size: 10 MB."
      trigger={
        <button
          type="button"
          className="col-span-1 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-alt px-4 text-sm font-medium text-text-muted transition hover:border-text-placeholder hover:text-text-main"
        >
          + Upload image
        </button>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Choose image file</span>
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
    </UIModal>
  );
}
