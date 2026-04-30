"use client";

import { useState } from "react";

import type { ProjectAssetListItem } from "@/components/assets/types";
import { UIButton } from "@/components/ui/button";
import {
  UIDialog,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
} from "@/components/ui/dialog";
import { UIModal } from "@/components/ui/modal";
import { formatUiDateTime } from "@/lib/ui-date-time";

type ImageAssetCardProps = {
  asset: ProjectAssetListItem;
  isDeleting: boolean;
  onDelete: (asset: ProjectAssetListItem) => Promise<void> | void;
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

export function ImageAssetCard({ asset, isDeleting, onDelete }: ImageAssetCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <UIModal
        size="lg"
        title={asset.originalFilename}
        description="Asset details"
        trigger={
          <button
            type="button"
            className="col-span-1 overflow-hidden rounded-2xl border border-line bg-surface-alt transition hover:border-text-placeholder"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.publicUrl}
              alt={asset.originalFilename}
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.publicUrl}
              alt={asset.originalFilename}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-text-placeholder">Kind: {asset.kind}</p>
            <p className="text-sm text-text-placeholder">Type: {asset.mimeType}</p>
            <p className="text-sm text-text-placeholder">Size: {formatFileSize(asset.sizeBytes)}</p>
            <p className="break-all text-sm text-text-placeholder">Storage key: {asset.storageKey}</p>
            <p className="text-sm text-text-placeholder">
              Created: {formatUiDateTime(asset.createdAt)}
            </p>
            <p className="text-sm text-text-placeholder">
              Updated: {formatUiDateTime(asset.updatedAt)}
            </p>
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                <UIButton asChild theme="base" variant="outlined" size="sm">
                  <a href={asset.publicUrl} target="_blank" rel="noreferrer">
                    Open file
                  </a>
                </UIButton>
                <UIButton
                  type="button"
                  theme="danger"
                  variant="outlined"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => setConfirmOpen(true)}
                >
                  {isDeleting ? "Deleting..." : "Delete image"}
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      </UIModal>

      <UIDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <UIDialogContent className="max-w-md">
          <UIDialogHeader>
            <UIDialogTitle>Delete image?</UIDialogTitle>
            <UIDialogDescription>
              {`Delete "${asset.originalFilename}" from this project? This action cannot be undone.`}
            </UIDialogDescription>
          </UIDialogHeader>
          <UIDialogFooter>
            <UIButton
              type="button"
              theme="base"
              variant="outlined"
              size="sm"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </UIButton>
            <UIButton
              type="button"
              theme="danger"
              variant="contained"
              size="sm"
              disabled={isDeleting}
              onClick={async () => {
                await onDelete(asset);
                setConfirmOpen(false);
              }}
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </UIButton>
          </UIDialogFooter>
        </UIDialogContent>
      </UIDialog>
    </>
  );
}
