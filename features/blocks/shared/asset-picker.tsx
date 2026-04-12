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
    <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <p className="text-sm text-zinc-600">{description}</p>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
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
                    ? "grid gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3"
                    : "grid gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
                }
              >
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
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
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {asset.originalFilename}
                    </p>
                    <p className="text-xs text-zinc-500">{asset.mimeType}</p>
                  </div>

                  <UIButton
                    type="button"
                    onClick={() => onSelect(asset.id)}
                    className={
                      isSelected
                        ? "inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                        : "inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
                    }
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
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-900">{selectedStateTitle}</p>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
            <Image
              src={selectedAsset.publicUrl}
              alt={selectedAsset.alt ?? selectedAsset.originalFilename}
              width={960}
              height={448}
              unoptimized
              className={compact ? "h-48 w-full object-cover" : "h-56 w-full object-cover"}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600">
            <span>Asset ID: {selectedAsset.id}</span>
            <UIButton
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              {clearLabel}
            </UIButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
