"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

import type { ProjectAssetListItem } from "@/components/assets/types";
import { UIButton } from "@/components/ui/button";

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
  const [isDragActive, setIsDragActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedMimeTypes = useMemo(
    () => ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
    []
  );

  function readValidFiles(fileList: FileList | null) {
    if (!fileList) {
      return [];
    }

    return Array.from(fileList).filter(
      (file) => file.size > 0 && acceptedMimeTypes.includes(file.type)
    );
  }

  async function uploadFiles(files: File[]) {
    setMessage(null);
    setError(null);

    if (files.length === 0) {
      const nextError = "Choose at least one JPEG, PNG, WEBP, or SVG file.";
      setError(nextError);
      onUploadError?.(nextError);
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    const failedFiles: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/projects/${projectId}/assets`, {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        asset?: ProjectAssetListItem;
        error?: string;
      };

      if (!response.ok || !payload.asset) {
        failedFiles.push(file.name);
        continue;
      }

      successCount += 1;
      onUploaded(payload.asset);
    }

    setIsUploading(false);

    if (successCount > 0) {
      setMessage(
        failedFiles.length > 0
          ? `Uploaded ${successCount} file(s). Failed: ${failedFiles.length}.`
          : `Uploaded ${successCount} file(s).`
      );
    }

    if (failedFiles.length > 0 && successCount === 0) {
      const nextError = `Upload failed for ${failedFiles.length} file(s).`;
      setError(nextError);
      onUploadError?.(nextError);
      return;
    }

    if (failedFiles.length > 0) {
      const nextError = `Some files failed: ${failedFiles.join(", ")}`;
      setError(nextError);
      onUploadError?.(nextError);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`flex min-h-40 w-full flex-col justify-center rounded-2xl border border-dashed p-4 transition ${
        isDragActive
          ? "border-focus bg-surface"
          : "border-line bg-surface-alt hover:border-text-placeholder"
      }`}
      onDragEnter={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
      }}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
      }}
      onDragLeave={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsDragActive(false);
        }
      }}
      onDrop={async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        if (isUploading) {
          return;
        }
        await uploadFiles(readValidFiles(event.dataTransfer.files));
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="sr-only"
        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
          if (isUploading) {
            return;
          }
          await uploadFiles(readValidFiles(event.currentTarget.files));
        }}
      />
      <div className="grid gap-2 text-center">
        <p className="text-sm font-medium text-text-main">Drop images here</p>
        <p className="text-xs text-text-muted">JPEG, PNG, WEBP, SVG. Multiple files supported.</p>
        <UIButton
          type="button"
          disabled={isUploading}
          theme="base"
          variant="outlined"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : "Choose files"}
        </UIButton>
      </div>
      {message ? (
        <p className="mt-2 rounded-lg border border-primary-line bg-primary-100 px-2 py-1 text-xs text-text-inverted-main">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 rounded-lg border border-danger-line bg-danger-100 px-2 py-1 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
