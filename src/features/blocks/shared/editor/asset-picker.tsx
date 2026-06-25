"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProjectAssetRecord } from "@/lib/assets";
import { UIButton } from "@/components/ui/button";
import {
  UIDialog,
  UIDialogClose,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
  UIDialogTrigger,
} from "@/components/ui/dialog";

import { Card } from "@/components/ui/card";

type AssetPickerProps = {
  assets: ProjectAssetRecord[];
  selectedAssetId?: string;
  onSelect: (assetId: string) => void;
  onClear: () => void;
  title: string;
  description?: string;
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
  description = '',
  emptyMessage,
  clearLabel = "Clear image",
  selectLabel = "Use",
  selectedLabel = "Selected",
  selectedStateTitle = "",
  layout = "list",
  compact = false,
  selectionContainerClassName,
}: AssetPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? null;

  return (
    <Card className="bg-surface-alt">
      <div className="grid gap-3">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-text-main">{title}</h4>
          <p className="text-sm text-text-muted">{description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted">
          {assets.length === 0 ? (
            <p className="text-sm text-text-muted">{emptyMessage}</p>
          ) : (
            <UIDialog open={pickerOpen} onOpenChange={setPickerOpen}>
              <UIDialogTrigger>
                <UIButton type="button" theme="base" variant="outlined" size="sm">
                  {selectedAsset ? "Change image" : selectLabel}
                </UIButton>
              </UIDialogTrigger>
              <UIDialogContent className="max-w-5xl">
                <UIDialogHeader>
                  <UIDialogTitle>{title}</UIDialogTitle>
                  <UIDialogDescription>{description}</UIDialogDescription>
                </UIDialogHeader>

                <div className="max-h-[68vh] overflow-y-auto pr-1">
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
                              onClick={() => {
                                onSelect(asset.id);
                                setPickerOpen(false);
                              }}
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
                </div>

                <UIDialogFooter>
                  <UIDialogClose>
                    <UIButton type="button" theme="base" variant="outlined" size="sm">
                      Close
                    </UIButton>
                  </UIDialogClose>
                </UIDialogFooter>
              </UIDialogContent>
            </UIDialog>
          )}

          {selectedAsset &&
            <UIButton
              type="button"
              onClick={onClear}
              theme="base"
              variant="outlined"
              size="sm"
            >
              {clearLabel}
            </UIButton>
          }
        </div>

        {selectedAsset ? (
          <div>
            <p className="text-sm font-medium text-text-main mb-2">{selectedStateTitle}</p>
            <div className="w-full overflow-hidden rounded-2xl bg-surface">
              <Image
                src={selectedAsset.publicUrl}
                alt={selectedAsset.alt ?? selectedAsset.originalFilename}
                width={960}
                height={448}
                unoptimized
                className={compact ? "h-48 w-full object-contain" : "h-56 w-full object-contain"}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
