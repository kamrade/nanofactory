"use client";

import Image from "next/image";

import type { ProjectAssetRecord } from "@/lib/assets";
import { UIButton } from "@/components/ui/button";

type AssetPickerProps = {
  assets: ProjectAssetRecord[];
  selectedAssetId?: string;
  onSelect: (assetId: string) => void;
  onClear: () => void;
  title: string;
  description: string;
  emptyMessage: string;
  clearLabel?: string;
  selectLabel?: string;
  selectedLabel?: string;
  selectedStateTitle?: string;
  layout?: "list" | "grid";
  compact?: boolean;
  selectionContainerClassName?: string;
};

export function AssetPicker({
  assets,
  selectedAssetId,
  onSelect,
  onClear,
  title,
  description,
  emptyMessage,
  clearLabel = "Clear image",
  selectLabel = "Use",
  selectedLabel = "Selected",
  selectedStateTitle = "Selected asset preview",
  layout = "list",
  compact = false,
  selectionContainerClassName,
}: AssetPickerProps) {
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? null;

  return (
    <div className="grid gap-3">
      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-text-main">{title}</h4>
        <p className="text-sm text-text-muted">{description}</p>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      ) : (
        <div
          className={
            selectionContainerClassName ??
            (layout === "grid" ? "grid gap-3 md:grid-cols-2" : "grid gap-3")
          }
        >
          {assets.map((asset) => {
            const isSelected = selectedAssetId === asset.id;

            return (
              <article
                key={asset.id}
                className={
                  isSelected
                    ? "grid gap-3 rounded-2xl border border-focus bg-surface-alt p-3"
                    : "grid gap-3 rounded-2xl border border-line bg-surface-alt p-3"
                }
              >
                <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface-alt">
                  <Image
                    src={asset.publicUrl}
                    alt={asset.alt ?? asset.originalFilename}
                    width={640}
                    height={320}
                    unoptimized
                    className={compact ? "h-32 w-full object-cover" : "h-40 w-full object-cover"}
                  />
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="break-all text-sm font-medium text-text-main">
                      {asset.originalFilename}
                    </p>
                    <p className="break-all text-xs text-text-muted">{asset.mimeType}</p>
                  </div>

                </div>
                <div>
                  <UIButton
                    type="button"
                    onClick={() => onSelect(asset.id)}
                    theme={isSelected ? "primary" : "base"}
                    variant={isSelected ? "contained" : "outlined"}
                    size="sm"
                  >
                    {isSelected ? selectedLabel : selectLabel}
                  </UIButton>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedAsset ? (
        <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
          <p className="text-sm font-medium text-text-main">{selectedStateTitle}</p>
          <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface">
            <Image
              src={selectedAsset.publicUrl}
              alt={selectedAsset.alt ?? selectedAsset.originalFilename}
              width={960}
              height={448}
              unoptimized
              className={compact ? "h-48 w-full object-cover" : "h-56 w-full object-cover"}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted">
            <span>Asset ID: {selectedAsset.id}</span>
            <UIButton
              type="button"
              onClick={onClear}
              theme="base"
              variant="outlined"
              size="sm"
            >
              {clearLabel}
            </UIButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
