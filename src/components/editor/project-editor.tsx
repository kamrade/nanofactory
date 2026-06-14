"use client";

import { useEffect, useMemo, useReducer } from "react";
import Link from "next/link";
import { FiArrowLeft, FiSettings } from "react-icons/fi";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import {
  type BlockVariant,
  createPageBlock,
  getBlockDefinition,
  getBlockVariants,
  type SupportedBlockType,
} from "@/lib/editor/blocks";

import { BlockSettingsSheet } from "@/components/editor/block-settings-sheet";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import {
  EDITOR_ADD_BLOCK_EVENT,
  type EditorAddBlockEventDetail,
} from "@/components/editor/editor-events";
import {
  applyVariantSwitchToContent,
  createPendingVariantSwitch,
  type PendingVariantSwitch,
  type VariantUndo,
  undoVariantSwitchInContent,
} from "@/components/editor/project-editor-variants";
import { setPreviewDraftContent } from "@/components/editor/preview-draft-store";
import { SectionShell } from "@/components/projects/section-shell";
import { UIButton } from "@/components/ui/button";
import type { PageBlock } from "@/features/blocks/shared/content";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import { useToast } from "@/hooks/use-toast";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import {
  buildEffectivePageAnchors,
  getGalleryItemEffectiveAnchor,
  normalizeAnchorId,
} from "@/lib/editor/anchor-id";
import type { UiMode } from "@/lib/ui-preferences";
import type { ThemeKey } from "@/lib/themes";

type EditorProject = {
  id: string;
  name: string;
  slug: string;
  themeKey: string;
  modePolicy: "switchable" | "light-only" | "dark-only";
  borderRadiusPolicy: "none" | "md" | "lg";
  spacingScale: "sm" | "md" | "lg";
  status: "draft" | "published";
  contentJson: PageContent;
};

type ProjectEditorProps = {
  project: EditorProject;
  assets: ProjectAssetRecord[];
  activeThemeKey: ThemeKey;
  activeMode: UiMode;
  backgroundScenes?: BackgroundSceneRecord[];
};

type EditorState = {
  content: PageContent;
  activeEditorBlockId: string | null;
  pendingVariantSwitch: PendingVariantSwitch | null;
  lastVariantUndo: VariantUndo | null;
};

type EditorAction =
  | { type: "add_block"; blockType: SupportedBlockType; variant: BlockVariant }
  | { type: "delete_block"; blockId: string }
  | { type: "move_block"; blockId: string; nextIndex: number }
  | { type: "update_block_props"; blockId: string; nextProps: Record<string, unknown> }
  | { type: "update_block_anchor_id"; blockId: string; nextAnchorId?: string }
  | { type: "update_block_background_scene"; blockId: string; nextSceneId?: string }
  | { type: "select_variant"; block: PageBlock; definition: BlockVariantDefinition; nextVariant: BlockVariant }
  | { type: "confirm_variant_switch" }
  | { type: "cancel_variant_switch" }
  | { type: "undo_variant_switch" }
  | { type: "dismiss_variant_undo" }
  | { type: "open_block"; blockId: string }
  | { type: "close_sheet" };

function formatDefinitionLabel(definition: {
  typeLabel: string;
  label: string;
  variant: string;
}) {
  return definition.typeLabel;
}

function updateBlockById(
  content: PageContent,
  blockId: string,
  updater: (block: PageBlock) => PageBlock
): PageContent {
  return {
    blocks: content.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
  };
}

function moveBlock(content: PageContent, blockId: string, nextIndex: number): PageContent {
  const currentIndex = content.blocks.findIndex((block) => block.id === blockId);
  if (currentIndex < 0 || currentIndex === nextIndex) {
    return content;
  }

  const boundedIndex = Math.max(0, Math.min(nextIndex, content.blocks.length - 1));
  if (currentIndex === boundedIndex) {
    return content;
  }

  const nextBlocks = [...content.blocks];
  const [movedBlock] = nextBlocks.splice(currentIndex, 1);
  nextBlocks.splice(boundedIndex, 0, movedBlock);

  return { blocks: nextBlocks };
}

function applyVariantSwitchInState(
  state: EditorState,
  blockId: string,
  nextDefinition: BlockVariantDefinition
): EditorState {
  const result = applyVariantSwitchToContent(state.content, blockId, nextDefinition, getBlockDefinition);

  return {
    ...state,
    content: result.content,
    pendingVariantSwitch: null,
    lastVariantUndo: result.undo ?? state.lastVariantUndo,
  };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "add_block": {
      const nextBlock = createPageBlock(action.blockType, action.variant);
      return {
        ...state,
        content: { blocks: [...state.content.blocks, nextBlock] },
        activeEditorBlockId: nextBlock.id,
        pendingVariantSwitch: null,
      };
    }
    case "delete_block": {
      return {
        ...state,
        content: {
          blocks: state.content.blocks.filter((block) => block.id !== action.blockId),
        },
        activeEditorBlockId:
          state.activeEditorBlockId === action.blockId ? null : state.activeEditorBlockId,
        pendingVariantSwitch:
          state.pendingVariantSwitch?.blockId === action.blockId ? null : state.pendingVariantSwitch,
        lastVariantUndo:
          state.lastVariantUndo?.blockId === action.blockId ? null : state.lastVariantUndo,
      };
    }
    case "move_block": {
      return {
        ...state,
        content: moveBlock(state.content, action.blockId, action.nextIndex),
      };
    }
    case "update_block_props": {
      return {
        ...state,
        content: updateBlockById(state.content, action.blockId, (block) => ({
          ...block,
          props: action.nextProps,
        })),
      };
    }
    case "update_block_anchor_id": {
      return {
        ...state,
        content: updateBlockById(state.content, action.blockId, (block) => ({
          ...block,
          anchorId:
            typeof action.nextAnchorId === "string" && action.nextAnchorId.trim().length > 0
              ? normalizeAnchorId(action.nextAnchorId)
              : undefined,
        })),
      };
    }
    case "update_block_background_scene": {
      return {
        ...state,
        content: updateBlockById(state.content, action.blockId, (block) => ({
          ...block,
          backgroundSceneId:
            typeof action.nextSceneId === "string" && action.nextSceneId.trim().length > 0
              ? action.nextSceneId
              : undefined,
        })),
      };
    }
    case "select_variant": {
      const pendingSwitch = createPendingVariantSwitch(
        action.block,
        action.definition,
        action.nextVariant,
        getBlockDefinition
      );

      if (!pendingSwitch) {
        return {
          ...state,
          pendingVariantSwitch: null,
        };
      }

      if (pendingSwitch.lostKeys.length === 0) {
        return applyVariantSwitchInState(state, action.block.id, pendingSwitch.nextDefinition);
      }

      return {
        ...state,
        pendingVariantSwitch: pendingSwitch,
      };
    }
    case "confirm_variant_switch": {
      if (!state.pendingVariantSwitch) {
        return state;
      }

      return applyVariantSwitchInState(
        state,
        state.pendingVariantSwitch.blockId,
        state.pendingVariantSwitch.nextDefinition
      );
    }
    case "cancel_variant_switch": {
      return {
        ...state,
        pendingVariantSwitch: null,
      };
    }
    case "undo_variant_switch": {
      if (!state.lastVariantUndo) {
        return state;
      }

      return {
        ...state,
        content: undoVariantSwitchInContent(state.content, state.lastVariantUndo),
        lastVariantUndo: null,
      };
    }
    case "dismiss_variant_undo": {
      return {
        ...state,
        lastVariantUndo: null,
      };
    }
    case "open_block": {
      return {
        ...state,
        activeEditorBlockId: action.blockId,
      };
    }
    case "close_sheet": {
      return {
        ...state,
        activeEditorBlockId: null,
        pendingVariantSwitch: null,
      };
    }
    default: {
      return state;
    }
  }
}

export function ProjectEditor({
  project,
  assets,
  activeThemeKey,
  activeMode,
  backgroundScenes = [],
}: ProjectEditorProps) {
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(editorReducer, {
    content: project.contentJson,
    activeEditorBlockId: null,
    pendingVariantSwitch: null,
    lastVariantUndo: null,
  });

  const assetMap = useMemo(() => buildAssetMap(assets), [assets]);
  const sceneMap = useMemo(
    () => new Map(backgroundScenes.map((scene) => [scene.id, scene] as const)),
    [backgroundScenes]
  );
  useEffect(() => {
    setPreviewDraftContent(state.content);
  }, [state.content]);

  useEffect(() => {
    if (!state.lastVariantUndo) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: "dismiss_variant_undo" });
    }, 10_000);

    return () => window.clearTimeout(timer);
  }, [state.lastVariantUndo]);

  useEffect(() => {
    function handleAddBlock(event: Event) {
      const detail = (event as CustomEvent<EditorAddBlockEventDetail>).detail;
      if (!detail) {
        return;
      }

      dispatch({
        type: "add_block",
        blockType: detail.blockType,
        variant: detail.variant,
      });
    }

    window.addEventListener(EDITOR_ADD_BLOCK_EVENT, handleAddBlock);
    return () => {
      window.removeEventListener(EDITOR_ADD_BLOCK_EVENT, handleAddBlock);
    };
  }, []);

  const effectiveAnchors = useMemo(
    () => buildEffectivePageAnchors(state.content.blocks),
    [state.content.blocks]
  );

  function renderBlockPreview(block: PageBlock) {
    const definition = getBlockDefinition(block.type, block.variant);
    if (!definition) {
      return null;
    }

    const BlockRenderer = definition.Renderer;
    const blockShellRadiusClassName =
      block.type === "features" ||
      block.type === "cta" ||
      block.type === "app-header" ||
      block.type === "gallery" ||
      block.type === "hero" ||
      block.type === "projects-gallery" ||
      block.type === "footer"
        ? project.borderRadiusPolicy === "none"
          ? "rounded-none"
          : project.borderRadiusPolicy === "md"
            ? "rounded-xl"
            : "rounded-3xl"
        : undefined;
    const backgroundScene =
      typeof block.backgroundSceneId === "string"
        ? sceneMap.get(block.backgroundSceneId)?.sceneJson ?? null
        : null;
    const effectiveAnchorId = effectiveAnchors.blockAnchors.get(block.id);
    const galleryItemAnchors =
      block.type === "gallery" && Array.isArray(block.props.items)
        ? new Map(
            block.props.items
              .map((_, index) => [
                index,
                getGalleryItemEffectiveAnchor(effectiveAnchors.galleryItemAnchors, block.id, index),
              ] as const)
              .filter((entry): entry is readonly [number, string] => Boolean(entry[1]))
          )
        : undefined;

    return (
      <SectionShell
        anchorId={effectiveAnchorId}
        containerClassName="mx-auto container"
        innerRadiusClassName={blockShellRadiusClassName}
        backgroundScene={backgroundScene}
        fallbackThemeKey={activeThemeKey}
        fallbackMode={activeMode}
      >
        <BlockRenderer
          block={block}
          assetMap={assetMap}
          mode={activeMode}
          projectBorderRadiusPolicy={project.borderRadiusPolicy}
          projectSpacingScale={project.spacingScale}
          effectiveGalleryItemAnchors={galleryItemAnchors}
          theme={{
            muted: "text-text-muted",
            buttonTone:
              "inline-flex items-center justify-center rounded-2xl border border-transparent bg-primary-300 font-medium text-text-inverted-main transition hover:bg-primary-200 active:bg-primary-100",
            button:
              "inline-flex items-center justify-center rounded-2xl border border-transparent bg-primary-300 px-5 py-3 text-sm font-medium text-text-inverted-main transition hover:bg-primary-200 active:bg-primary-100",
            kicker: "text-text-placeholder",
          }}
        />
      </SectionShell>
    );
  }

  const activeEditorBlock = useMemo(
    () => state.content.blocks.find((block) => block.id === state.activeEditorBlockId) ?? null,
    [state.activeEditorBlockId, state.content.blocks]
  );
  const activeEditorDefinition = useMemo(
    () =>
      activeEditorBlock
        ? getBlockDefinition(activeEditorBlock.type, activeEditorBlock.variant)
        : null,
    [activeEditorBlock]
  );
  const activeVariantOptions = useMemo(
    () => (activeEditorDefinition ? getBlockVariants(activeEditorDefinition.type) : []),
    [activeEditorDefinition]
  );
  const activePendingSwitch =
    state.pendingVariantSwitch && state.pendingVariantSwitch.blockId === activeEditorBlock?.id
      ? state.pendingVariantSwitch
      : null;
  const activeVariant = activePendingSwitch
    ? activePendingSwitch.nextVariant
    : activeEditorDefinition?.variant;
  const activeEditorBlockIndex = activeEditorBlock
    ? state.content.blocks.findIndex((block) => block.id === activeEditorBlock.id)
    : -1;
  const availableAnchors = useMemo(
    () => {
      const anchors: Array<{ id: string; label: string }> = [];

      state.content.blocks.forEach((block, index) => {
        const anchorId = effectiveAnchors.blockAnchors.get(block.id);
        if (anchorId) {
          anchors.push({
            id: anchorId,
            label: `${index + 1}. ${formatDefinitionLabel(
              getBlockDefinition(block.type, block.variant) ?? {
                typeLabel: block.type,
                label: block.type,
                variant: block.variant ?? "default",
              }
            )} (${anchorId})`,
          });
        }
      });

      return anchors;
    },
    [effectiveAnchors.blockAnchors, state.content.blocks]
  );
  const activeGalleryItemAnchors = useMemo(() => {
    if (!activeEditorBlock || activeEditorBlock.type !== "gallery" || !Array.isArray(activeEditorBlock.props.items)) {
      return undefined;
    }

    return new Map(
      activeEditorBlock.props.items
        .map((_, index) => [
          index,
          getGalleryItemEffectiveAnchor(effectiveAnchors.galleryItemAnchors, activeEditorBlock.id, index),
        ] as const)
        .filter((entry): entry is readonly [number, string] => Boolean(entry[1]))
    );
  }, [activeEditorBlock, effectiveAnchors.galleryItemAnchors]);

  function openProjectSettingsSheet() {
    document
      .querySelector<HTMLButtonElement>('[data-testid="project-settings-trigger"]')
      ?.click();
  }

  return (
    <div className="grid gap-6">
      <section data-testid="ProjectEditorContent" className="space-y-4 px-3 md:px-20">
        <div className="mx-auto container">
          <div className="flex items-center justify-between md:hidden py-3">
            <UIButton asChild theme="base" variant="outlined" size="sm" iconButton className="rounded-full">
              <Link href="/dashboard" aria-label="Back to dashboard" title="Back to dashboard">
                <FiArrowLeft aria-hidden className="h-4 w-4" />
              </Link>
            </UIButton>
            <UIButton
              type="button"
              theme="base"
              variant="contained"
              size="sm"
              iconButton
              aria-label="Settings"
              title="Settings"
              className="rounded-full"
              onClick={openProjectSettingsSheet}
            >
              <FiSettings aria-hidden className="h-4 w-4" />
            </UIButton>
          </div>
        </div>  

        <EditorCanvas
          content={state.content}
          lastVariantUndo={state.lastVariantUndo}
          onUndoVariantSwitch={() => dispatch({ type: "undo_variant_switch" })}
          onDismissVariantUndo={() => dispatch({ type: "dismiss_variant_undo" })}
          onSelectBlock={(blockId) => dispatch({ type: "open_block", blockId })}
          renderBlockPreview={renderBlockPreview}
          formatDefinitionLabel={formatDefinitionLabel}
          getBlockDefinition={getBlockDefinition}
        />
      </section>

      <BlockSettingsSheet
        open={Boolean(activeEditorBlock && activeEditorDefinition)}
        activeEditorBlock={activeEditorBlock}
        activeEditorDefinition={activeEditorDefinition}
        activeVariantOptions={activeVariantOptions}
        activeVariant={activeVariant}
        activePendingSwitch={activePendingSwitch}
        assets={assets}
        availableAnchors={availableAnchors}
        effectiveGalleryItemAnchors={activeGalleryItemAnchors}
        backgroundScenes={backgroundScenes}
        activeThemeKey={activeThemeKey}
        activeMode={activeMode}
        activeEditorBlockIndex={activeEditorBlockIndex}
        totalBlocks={state.content.blocks.length}
        formatDefinitionLabel={formatDefinitionLabel}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            dispatch({ type: "close_sheet" });
          }
        }}
        onSelectVariant={(block, definition, nextVariant) =>
          dispatch({ type: "select_variant", block, definition, nextVariant })
        }
        onSelectScene={(blockId, nextSceneId) =>
          dispatch({ type: "update_block_background_scene", blockId, nextSceneId })
        }
        onConfirmVariantSwitch={() => dispatch({ type: "confirm_variant_switch" })}
        onCancelVariantSwitch={() => dispatch({ type: "cancel_variant_switch" })}
        onChangeProps={(blockId, nextProps) =>
          dispatch({ type: "update_block_props", blockId, nextProps })
        }
        onChangeAnchorId={(blockId, nextAnchorId) =>
          dispatch({ type: "update_block_anchor_id", blockId, nextAnchorId })
        }
        onMoveBlock={(blockId, nextIndex) =>
          dispatch({ type: "move_block", blockId, nextIndex })
        }
        onDeleteBlock={(blockId) => dispatch({ type: "delete_block", blockId })}
        allBlocks={state.content.blocks}
        effectiveAnchorId={
          activeEditorBlock ? effectiveAnchors.blockAnchors.get(activeEditorBlock.id) : undefined
        }
        onAnchorIdRejected={(message) =>
          showToast({
            tone: "error",
            title: message,
          })
        }
      />
    </div>
  );
}
