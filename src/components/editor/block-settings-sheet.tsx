"use client";

import { useMemo, useState } from "react";
import {
  FiChevronsDown,
  FiChevronsUp,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import {
  getBlockDefinition,
  getBlockVariants,
  type BlockVariant,
} from "@/lib/editor/blocks";
import type { PendingVariantSwitch } from "@/components/editor/project-editor-variants";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import type { PageBlock } from "@/features/blocks/shared/content";
import { ScenePicker } from "@/features/blocks/shared/editor/scene-picker";
import type { ProjectAssetRecord } from "@/lib/assets";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { isValidAnchorId, normalizeAnchorId } from "@/lib/editor/anchor-id";
import { UIAccordion } from "@/components/ui/accordion";
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
  UISheetHeader,
  UISheetTitle,
} from "@/components/ui/sheet";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type BlockSettingsSheetProps = {
  open: boolean;
  activeEditorBlockId: string | null;
  activePendingSwitch: PendingVariantSwitch | null;
  assets: ProjectAssetRecord[];
  availableAnchors: Array<{
    id: string;
    label: string;
  }>;
  effectiveGalleryItemAnchorsByBlock: Map<string, Map<number, string>>;
  backgroundScenes: BackgroundSceneRecord[];
  activeThemeKey: ThemeKey;
  activeMode: UiMode;
  formatDefinitionLabel: (definition: {
    typeLabel: string;
    label: string;
    variant: string;
  }) => string;
  onOpenChange: (open: boolean) => void;
  onSelectBlock: (blockId: string) => void;
  onCollapseActiveBlock: () => void;
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
  effectiveBlockAnchors: Map<string, string>;
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

type BlockSettingsSectionProps = {
  block: PageBlock;
  definition: BlockVariantDefinition;
  pendingVariantSwitch: PendingVariantSwitch | null;
  assets: ProjectAssetRecord[];
  availableAnchors: Array<{
    id: string;
    label: string;
  }>;
  effectiveGalleryItemAnchors?: Map<number, string>;
  backgroundScenes: BackgroundSceneRecord[];
  allBlocks: PageBlock[];
  effectiveAnchorId?: string;
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
  onDeleteBlock: (blockId: string) => void;
};

function BlockSettingsSection({
  block,
  definition,
  pendingVariantSwitch,
  assets,
  availableAnchors,
  effectiveGalleryItemAnchors,
  backgroundScenes,
  allBlocks,
  effectiveAnchorId,
  onSelectVariant,
  onSelectScene,
  onConfirmVariantSwitch,
  onCancelVariantSwitch,
  onChangeProps,
  onChangeAnchorId,
  onDeleteBlock,
}: BlockSettingsSectionProps) {
  const variantOptions = getBlockVariants(definition.type);
  const activeVariant = pendingVariantSwitch ? pendingVariantSwitch.nextVariant : definition.variant;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          {variantOptions.length > 1 ? (
            <UIFormRow label="Variant" htmlFor={`block-variant-select-${block.id}`} borderless>
              <UISelect
                id={`block-variant-select-${block.id}`}
                ariaLabel="Variant"
                size="sm"
                borderless
                className="w-full"
                value={activeVariant}
                onValueChange={(value) =>
                  onSelectVariant(block, definition, value as BlockVariant)
                }
                options={variantOptions.map((option) => ({
                  value: option.variant,
                  label: option.label,
                  textValue: option.label,
                }))}
              />
            </UIFormRow>
          ) : null}

          <BlockAnchorIdField
            key={block.id}
            blockId={block.id}
            initialAnchorId={block.anchorId}
            effectiveAnchorId={effectiveAnchorId}
            allBlocks={allBlocks}
            onChangeAnchorId={onChangeAnchorId}
          />
        </div>
      </Card>

      <Card className="bg-surface-alt">
        <ScenePicker
          scenes={backgroundScenes}
          selectedSceneId={block.backgroundSceneId}
          onSelect={(sceneId) => onSelectScene(block.id, sceneId)}
          onClear={() => onSelectScene(block.id, undefined)}
          title="Background scene"
          description="Attach a reusable background scene to this block shell."
          emptyMessage="Create a scene in Background Editor first, then select it here."
        />
      </Card>

      {pendingVariantSwitch ? (
        <div className="rounded-2xl border border-line bg-surface-alt px-4 py-3 text-sm text-text-main">
          <p className="font-medium text-text-main">
            Switching variant will remove: {pendingVariantSwitch.lostLabels.join(", ")}.
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

      <definition.Editor
        block={block}
        assets={assets}
        availableAnchors={availableAnchors}
        effectiveGalleryItemAnchors={effectiveGalleryItemAnchors}
        definition={definition}
        onChange={(nextProps) => onChangeProps(block.id, nextProps)}
      />

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-line pt-4">
        <UIButton
          type="button"
          size="sm"
          theme="danger"
          variant="outlined"
          onClick={() => onDeleteBlock(block.id)}
        >
          Delete block
        </UIButton>
      </div>
    </div>
  );
}

export function BlockSettingsSheet({
  open,
  activeEditorBlockId,
  activePendingSwitch,
  assets,
  availableAnchors,
  effectiveGalleryItemAnchorsByBlock,
  backgroundScenes,
  activeThemeKey,
  activeMode,
  formatDefinitionLabel,
  onOpenChange,
  onSelectBlock,
  onCollapseActiveBlock,
  onSelectVariant,
  onSelectScene,
  onConfirmVariantSwitch,
  onCancelVariantSwitch,
  onChangeProps,
  onChangeAnchorId,
  onMoveBlock,
  onDeleteBlock,
  allBlocks,
  effectiveBlockAnchors,
}: BlockSettingsSheetProps) {
  const accordionItems = useMemo(
    () =>
      allBlocks.flatMap((block, index) => {
        const definition = getBlockDefinition(block.type, block.variant);
        if (!definition) {
          return [];
        }

        return [
          {
            id: block.id,
            title: formatDefinitionLabel(definition),
            actions: (
              <div className="flex items-center gap-1">
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="text"
                  iconButton
                  disabled={index === 0}
                  aria-label="Move block to top"
                  title="Move block to top"
                  className="text-text-muted"
                  onClick={() => onMoveBlock(block.id, 0)}
                >
                  <FiChevronsUp aria-hidden className="h-4 w-4" />
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="text"
                  iconButton
                  disabled={index === 0}
                  aria-label="Move block up"
                  title="Move block up"
                  className="text-text-muted"
                  onClick={() => onMoveBlock(block.id, index - 1)}
                >
                  <FiChevronUp aria-hidden className="h-4 w-4" />
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="text"
                  iconButton
                  disabled={index === allBlocks.length - 1}
                  aria-label="Move block down"
                  title="Move block down"
                  className="text-text-muted"
                  onClick={() => onMoveBlock(block.id, index + 1)}
                >
                  <FiChevronDown aria-hidden className="h-4 w-4" />
                </UIButton>
                <UIButton
                  type="button"
                  size="sm"
                  theme="base"
                  variant="text"
                  iconButton
                  disabled={index === allBlocks.length - 1}
                  aria-label="Move block to bottom"
                  title="Move block to bottom"
                  className="text-text-muted"
                  onClick={() => onMoveBlock(block.id, allBlocks.length - 1)}
                >
                  <FiChevronsDown aria-hidden className="h-4 w-4" />
                </UIButton>
              </div>
            ),
            content: (
              <BlockSettingsSection
                block={block}
                definition={definition}
                pendingVariantSwitch={
                  activePendingSwitch?.blockId === block.id ? activePendingSwitch : null
                }
                assets={assets}
                availableAnchors={availableAnchors}
                effectiveGalleryItemAnchors={effectiveGalleryItemAnchorsByBlock.get(block.id)}
                backgroundScenes={backgroundScenes}
                allBlocks={allBlocks}
                effectiveAnchorId={effectiveBlockAnchors.get(block.id)}
                onSelectVariant={onSelectVariant}
                onSelectScene={onSelectScene}
                onConfirmVariantSwitch={onConfirmVariantSwitch}
                onCancelVariantSwitch={onCancelVariantSwitch}
                onChangeProps={onChangeProps}
                onChangeAnchorId={onChangeAnchorId}
                onDeleteBlock={onDeleteBlock}
              />
            ),
          },
        ];
      }),
    [
      activePendingSwitch,
      allBlocks,
      assets,
      availableAnchors,
      backgroundScenes,
      effectiveBlockAnchors,
      effectiveGalleryItemAnchorsByBlock,
      formatDefinitionLabel,
      onCancelVariantSwitch,
      onChangeAnchorId,
      onChangeProps,
      onConfirmVariantSwitch,
      onDeleteBlock,
      onMoveBlock,
      onSelectScene,
      onSelectVariant,
    ]
  );

  return (
    <UISheet open={open} onOpenChange={onOpenChange} className="feature-component-editor-wrapper">
      <UISheetContent
        side="right"
        ariaLabel="Block editor"
        closeOnOverlayClick
        modal
        themeKey={activeThemeKey}
        mode={activeMode}
        className="p-5 sm:p-6"
      >
        <UISheetHeader>
          <UISheetClose>
            <UIButton type="button" size="sm" theme="base" variant="outlined" className="mb-6">
              Close
            </UIButton>
          </UISheetClose>
          <UISheetTitle>Block settings</UISheetTitle>
          <UISheetDescription>
            Select a block, edit its content and settings, and jump to it in the page canvas.
          </UISheetDescription>
        </UISheetHeader>

        <div className="mt-6">
          {accordionItems.length > 0 ? (
            <UIAccordion
              ariaLabel="Project blocks"
              size="sm"
              value={activeEditorBlockId}
              collapsible
              onValueChange={(value) => {
                if (value) {
                  onSelectBlock(value);
                  return;
                }
                onCollapseActiveBlock();
              }}
              items={accordionItems}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-sm text-text-muted">
              No blocks yet. Add one from the editor toolbar first.
            </div>
          )}
        </div>
      </UISheetContent>
    </UISheet>
  );
}
