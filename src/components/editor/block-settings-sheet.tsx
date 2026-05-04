"use client";

import type { BlockVariant } from "@/lib/editor/blocks";
import type { PendingVariantSwitch } from "@/components/editor/project-editor-variants";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import type { PageBlock } from "@/features/blocks/shared/content";
import { ScenePicker } from "@/features/blocks/shared/scene-picker";
import type { ProjectAssetRecord } from "@/lib/assets";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import { UISelect } from "@/components/ui/select";
import {
  UISheet,
  UISheetClose,
  UISheetContent,
  UISheetDescription,
  UISheetFooter,
  UISheetHeader,
  UISheetTitle,
} from "@/components/ui/sheet";

type BlockSettingsSheetProps = {
  open: boolean;
  activeEditorBlock: PageBlock | null;
  activeEditorDefinition: BlockVariantDefinition | null;
  activeVariantOptions: BlockVariantDefinition[];
  activeVariant?: BlockVariant;
  activePendingSwitch: PendingVariantSwitch | null;
  assets: ProjectAssetRecord[];
  backgroundScenes: BackgroundSceneRecord[];
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
  onToggleFullBleed: (blockId: string, nextFullBleed: boolean) => void;
  onSelectScene: (blockId: string, sceneId?: string) => void;
  onConfirmVariantSwitch: () => void;
  onCancelVariantSwitch: () => void;
  onChangeProps: (blockId: string, nextProps: Record<string, unknown>) => void;
  onMoveBlock: (blockId: string, nextIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
};

export function BlockSettingsSheet({
  open,
  activeEditorBlock,
  activeEditorDefinition,
  activeVariantOptions,
  activeVariant,
  activePendingSwitch,
  assets,
  backgroundScenes,
  activeEditorBlockIndex,
  totalBlocks,
  formatDefinitionLabel,
  onOpenChange,
  onSelectVariant,
  onToggleFullBleed,
  onSelectScene,
  onConfirmVariantSwitch,
  onCancelVariantSwitch,
  onChangeProps,
  onMoveBlock,
  onDeleteBlock,
}: BlockSettingsSheetProps) {
  const canMoveActiveBlockUp = activeEditorBlockIndex > 0;
  const canMoveActiveBlockDown = activeEditorBlockIndex >= 0 && activeEditorBlockIndex < totalBlocks - 1;

  return (
    <UISheet open={open} onOpenChange={onOpenChange}>
      <UISheetContent
        side="right"
        ariaLabel="Block editor"
        closeOnOverlayClick
        modal={false}
        className="p-5 sm:p-6"
      >
        {activeEditorBlock && activeEditorDefinition ? (
          <>
            <UISheetHeader>
              <UISheetClose>
                <div className="mb-3">
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
              <div className="grid gap-4 rounded-2xl border border-neutral-line bg-surface-alt p-4">
                {activeVariantOptions.length > 1 ? (
                  <div className="grid gap-1.5">
                    <p className="text-sm font-medium text-text-main">Variant</p>
                    <UISelect
                      ariaLabel="Variant"
                      size="sm"
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
                  </div>
                ) : null}

                <UICheckbox
                  label="Full bleed"
                  checked={Boolean(activeEditorBlock.fullBleed)}
                  onChange={(event) => onToggleFullBleed(activeEditorBlock.id, event.target.checked)}
                />

                <ScenePicker
                  scenes={backgroundScenes}
                  selectedSceneId={activeEditorBlock.backgroundSceneId}
                  onSelect={(sceneId) => onSelectScene(activeEditorBlock.id, sceneId)}
                  onClear={() => onSelectScene(activeEditorBlock.id, undefined)}
                  title="Background scene"
                  description="Attach a reusable background scene to this block shell."
                  emptyMessage="Create a scene in Background Editor first, then select it here."
                />
              </div>

              {activePendingSwitch ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-medium">
                    Switching variant will remove: {activePendingSwitch.lostLabels.join(", ")}.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <UIButton
                      type="button"
                      onClick={onConfirmVariantSwitch}
                      className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-400 hover:bg-amber-200"
                    >
                      Switch variant
                    </UIButton>
                    <UIButton
                      type="button"
                      onClick={onCancelVariantSwitch}
                      className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-100"
                    >
                      Cancel
                    </UIButton>
                  </div>
                </div>
              ) : null}

              <activeEditorDefinition.Editor
                block={activeEditorBlock}
                assets={assets}
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
