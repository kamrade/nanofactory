"use client";

import { useState } from "react";

import type { BlockVariant } from "@/lib/editor/blocks";
import type { PendingVariantSwitch } from "@/components/editor/project-editor-variants";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import type { PageBlock } from "@/features/blocks/shared/content";
import { ScenePicker } from "@/features/blocks/shared/scene-picker";
import type { ProjectAssetRecord } from "@/lib/assets";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { isValidAnchorId, normalizeAnchorId } from "@/lib/editor/anchor-id";
import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UISelect } from "@/components/ui/select";
import { UIFormRow } from "@/components/ui/form-row";
import { UITextInput } from "@/components/ui/text-input";
import {
  UISheet,
  UISheetClose,
  UISheetContent,
  UISheetDescription,
  UISheetFooter,
  UISheetHeader,
  UISheetTitle,
} from "@/components/ui/sheet";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type BlockSettingsSheetProps = {
  open: boolean;
  activeEditorBlock: PageBlock | null;
  activeEditorDefinition: BlockVariantDefinition | null;
  activeVariantOptions: BlockVariantDefinition[];
  activeVariant?: BlockVariant;
  activePendingSwitch: PendingVariantSwitch | null;
  assets: ProjectAssetRecord[];
  availableAnchors: Array<{
    id: string;
    label: string;
  }>;
  effectiveGalleryItemAnchors?: Map<number, string>;
  backgroundScenes: BackgroundSceneRecord[];
  activeThemeKey: ThemeKey;
  activeMode: UiMode;
  activeEditorBlockIndex: number;
  totalBlocks: number;
  formatDefinitionLabel: (definition: {
    typeLabel: string;
    label: string;
    variant: string;
  }) => string;
  onOpenChange: (open: boolean) => void;
  onSelectVariant: (
    block: PageBlock,
    definition: BlockVariantDefinition,
    nextVariant: BlockVariant
  ) => void;
  onSelectScene: (blockId: string, sceneId?: string) => void;
  onConfirmVariantSwitch: () => void;
  onCancelVariantSwitch: () => void;
  onChangeProps: (blockId: string, nextProps: Record<string, unknown>) => void;
  onChangeAnchorId: (blockId: string, nextAnchorId?: string) => void;
  onMoveBlock: (blockId: string, nextIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  allBlocks: PageBlock[];
  effectiveAnchorId?: string;
  onAnchorIdRejected?: (message: string) => void;
};

function BlockAnchorIdField({
  blockId,
  initialAnchorId,
  effectiveAnchorId,
  allBlocks,
  onChangeAnchorId,
}: {
  blockId: string;
  initialAnchorId?: string;
  effectiveAnchorId?: string;
  allBlocks: PageBlock[];
  onChangeAnchorId: (blockId: string, nextAnchorId?: string) => void;
}) {
  const [anchorDraft, setAnchorDraft] = useState(initialAnchorId ?? "");
  const [anchorError, setAnchorError] = useState<string | null>(null);

  function validateAnchorId(nextAnchorId: string) {
    const normalizedAnchorId = normalizeAnchorId(nextAnchorId);

    if (normalizedAnchorId.length === 0) {
      setAnchorError(null);
      onChangeAnchorId(blockId, undefined);
      return;
    }

    if (!isValidAnchorId(normalizedAnchorId)) {
      setAnchorError(
        "Use lowercase Latin letters, numbers, and hyphens only. Must start with a letter."
      );
      return;
    }

    const hasDuplicate = allBlocks.some(
      (block) =>
        block.id !== blockId &&
        typeof block.anchorId === "string" &&
        normalizeAnchorId(block.anchorId) === normalizedAnchorId
    );

    if (hasDuplicate) {
      setAnchorError("This anchor id is already used by another block.");
      return;
    }

    setAnchorError(null);
    setAnchorDraft(normalizedAnchorId);
    onChangeAnchorId(blockId, normalizedAnchorId);
  }

  return (
    <UIFormRow label="Anchor id" htmlFor={`block-anchor-id-input-${blockId}`} borderless>
      <UITextInput
        id={`block-anchor-id-input-${blockId}`}
        size="sm"
        borderless
        value={anchorDraft}
        onValueChange={(value) => {
          setAnchorDraft(value);
          if (anchorError) {
            setAnchorError(null);
          }
        }}
        onBlur={(event) => validateAnchorId(event.currentTarget.value)}
        placeholder={effectiveAnchorId ?? "section-hero"}
        invalid={Boolean(anchorError)}
        aria-label="Anchor id"
      />
    </UIFormRow>
  );
}

export function BlockSettingsSheet({
  open,
  activeEditorBlock,
  activeEditorDefinition,
  activeVariantOptions,
  activeVariant,
  activePendingSwitch,
  assets,
  availableAnchors,
  effectiveGalleryItemAnchors,
  backgroundScenes,
  activeThemeKey,
  activeMode,
  activeEditorBlockIndex,
  totalBlocks,
  formatDefinitionLabel,
  onOpenChange,
  onSelectVariant,
  onSelectScene,
  onConfirmVariantSwitch,
  onCancelVariantSwitch,
  onChangeProps,
  onChangeAnchorId,
  onMoveBlock,
  onDeleteBlock,
  allBlocks,
  effectiveAnchorId,
}: BlockSettingsSheetProps) {
  const canMoveActiveBlockUp = activeEditorBlockIndex > 0;
  const canMoveActiveBlockDown = activeEditorBlockIndex >= 0 && activeEditorBlockIndex < totalBlocks - 1;

  function handleSheetOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <UISheet open={open} onOpenChange={handleSheetOpenChange} className="feature-component-editor-wrapper">
      <UISheetContent
        side="right"
        ariaLabel="Block editor"
        closeOnOverlayClick
        modal={false}
        themeKey={activeThemeKey}
        mode={activeMode}
        className="p-5 sm:p-6"
      >
        {activeEditorBlock && activeEditorDefinition ? (
          <>
            <UISheetHeader>
              <UISheetClose>
                <div className="mb-6">
                  <UIButton type="button" size="sm" theme="base" variant="outlined">
                    Close
                  </UIButton>
                </div>
              </UISheetClose>
              <UISheetTitle>{formatDefinitionLabel(activeEditorDefinition)}</UISheetTitle>
              <UISheetDescription>
                Edit block content and settings. Changes are applied immediately.
              </UISheetDescription>
            </UISheetHeader>

            <div className="mt-6 grid gap-5">
              <Card>
                <div className="grid gap-0">
                  {activeVariantOptions.length > 1 ? (
                    <UIFormRow label="Variant" htmlFor="block-variant-select" borderless>
                      <UISelect
                        id="block-variant-select"
                        ariaLabel="Variant"
                        size="sm"
                        borderless
                        className="w-full"
                        value={activeVariant}
                        onValueChange={(value) =>
                          onSelectVariant(
                            activeEditorBlock,
                            activeEditorDefinition,
                            value as BlockVariant
                          )
                        }
                        options={activeVariantOptions.map((option) => ({
                          value: option.variant,
                          label: option.label,
                          textValue: option.label,
                        }))}
                      />
                    </UIFormRow>
                  ) : null}

                  <BlockAnchorIdField
                    key={activeEditorBlock.id}
                    blockId={activeEditorBlock.id}
                    initialAnchorId={activeEditorBlock.anchorId}
                    effectiveAnchorId={effectiveAnchorId}
                    allBlocks={allBlocks}
                    onChangeAnchorId={onChangeAnchorId}
                  />

                </div>
              </Card>

              <Card className="bg-surface-alt">
                <ScenePicker
                  scenes={backgroundScenes}
                  selectedSceneId={activeEditorBlock.backgroundSceneId}
                  onSelect={(sceneId) => onSelectScene(activeEditorBlock.id, sceneId)}
                  onClear={() => onSelectScene(activeEditorBlock.id, undefined)}
                  title="Background scene"
                  description="Attach a reusable background scene to this block shell."
                  emptyMessage="Create a scene in Background Editor first, then select it here."
                />
              </Card>

              {activePendingSwitch ? (
                <div className="rounded-2xl border border-line bg-surface-alt px-4 py-3 text-sm text-text-main">
                  <p className="font-medium text-text-main">
                    Switching variant will remove: {activePendingSwitch.lostLabels.join(", ")}.
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Confirm to apply the new variant with these changes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <UIButton
                      type="button"
                      size="sm"
                      theme="primary"
                      variant="contained"
                      onClick={onConfirmVariantSwitch}
                    >
                      Switch variant
                    </UIButton>
                    <UIButton
                      type="button"
                      size="sm"
                      theme="base"
                      variant="outlined"
                      onClick={onCancelVariantSwitch}
                    >
                      Cancel
                    </UIButton>
                  </div>
                </div>
              ) : null}

              <activeEditorDefinition.Editor
                block={activeEditorBlock}
                assets={assets}
                availableAnchors={availableAnchors}
                effectiveGalleryItemAnchors={effectiveGalleryItemAnchors}
                definition={activeEditorDefinition}
                onChange={(nextProps) => onChangeProps(activeEditorBlock.id, nextProps)}
              />
            </div>

            <UISheetFooter className="justify-between border-t border-neutral-line pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="outlined"
                  disabled={!canMoveActiveBlockUp}
                  onClick={() => onMoveBlock(activeEditorBlock.id, 0)}
                >
                  ⇡
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="outlined"
                  disabled={!canMoveActiveBlockUp}
                  onClick={() => onMoveBlock(activeEditorBlock.id, activeEditorBlockIndex - 1)}
                >
                  ↑
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="outlined"
                  disabled={!canMoveActiveBlockDown}
                  onClick={() => onMoveBlock(activeEditorBlock.id, activeEditorBlockIndex + 1)}
                >
                  ↓
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="outlined"
                  disabled={!canMoveActiveBlockDown}
                  onClick={() => onMoveBlock(activeEditorBlock.id, totalBlocks - 1)}
                >
                  ⇣
                </UIButton>
              </div>
              <UIButton
                type="button"
                size="sm"
                theme="danger"
                variant="outlined"
                onClick={() => onDeleteBlock(activeEditorBlock.id)}
              >
                Delete block
              </UIButton>
            </UISheetFooter>
          </>
        ) : null}
      </UISheetContent>
    </UISheet>
  );
}
