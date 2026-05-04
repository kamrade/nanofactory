"use client";

import { useActionState, useEffect, useMemo, useReducer } from "react";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import {
  type BlockVariant,
  createPageBlock,
  getBlockDefinition,
  getBlockTypes,
  getBlockVariants,
  type SupportedBlockType,
} from "@/lib/editor/blocks";

import {
  type SaveEditorState,
  saveProjectContentAction,
} from "@/app/(protected)/projects/[projectId]/actions";
import { BlockSettingsSheet } from "@/components/editor/block-settings-sheet";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import {
  applyVariantSwitchToContent,
  createPendingVariantSwitch,
  type PendingVariantSwitch,
  type VariantUndo,
  undoVariantSwitchInContent,
} from "@/components/editor/project-editor-variants";
import { setPreviewDraftContent } from "@/components/editor/preview-draft-store";
import { SectionShell } from "@/components/projects/section-shell";
import type { PageBlock } from "@/features/blocks/shared/content";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import { useToast } from "@/hooks/use-toast";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { normalizeAnchorId } from "@/lib/editor/anchor-id";
import type { UiMode } from "@/lib/ui-preferences";
import type { ThemeKey } from "@/lib/themes";

type EditorProject = {
  id: string;
  name: string;
  slug: string;
  themeKey: string;
  status: "draft" | "published";
  contentJson: PageContent;
};

type ProjectEditorProps = {
  project: EditorProject;
  assets: ProjectAssetRecord[];
  initialMode: UiMode;
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
  initialMode,
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

  const initialSaveEditorState: SaveEditorState = {
    status: "idle",
    message: "",
  };
  const saveAction = saveProjectContentAction.bind(null, project.id);
  const [saveState, formAction, isPending] = useActionState(
    saveAction,
    initialSaveEditorState
  );

  const serializedContent = useMemo(() => JSON.stringify(state.content), [state.content]);
  const assetMap = useMemo(() => buildAssetMap(assets), [assets]);
  const sceneMap = useMemo(
    () => new Map(backgroundScenes.map((scene) => [scene.id, scene] as const)),
    [backgroundScenes]
  );
  const blockTypes = useMemo(() => getBlockTypes(), []);
  const addBlockGroups = useMemo(
    () =>
      blockTypes.map((blockType) => ({
        ...blockType,
        variants: getBlockVariants(blockType.type),
      })),
    [blockTypes]
  );

  useEffect(() => {
    setPreviewDraftContent(state.content);
  }, [state.content]);

  useEffect(() => {
    if (saveState.status === "idle" || !saveState.message) {
      return;
    }
    showToast({
      tone: saveState.status === "success" ? "default" : "error",
      title: saveState.message,
    });
  }, [saveState.message, saveState.status, showToast]);

  useEffect(() => {
    if (!state.lastVariantUndo) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: "dismiss_variant_undo" });
    }, 10_000);

    return () => window.clearTimeout(timer);
  }, [state.lastVariantUndo]);

  function renderBlockPreview(block: PageBlock) {
    const definition = getBlockDefinition(block.type, block.variant);
    if (!definition) {
      return null;
    }

    const BlockRenderer = definition.Renderer;
    const backgroundScene =
      typeof block.backgroundSceneId === "string"
        ? sceneMap.get(block.backgroundSceneId)?.sceneJson ?? null
        : null;

    return (
      <SectionShell
        block={block}
        containerClassName="mx-4"
        backgroundScene={backgroundScene}
        fallbackThemeKey={activeThemeKey}
        fallbackMode={activeMode}
      >
        <BlockRenderer
          block={block}
          assetMap={assetMap}
          mode={activeMode}
          theme={{
            muted: "text-text-muted",
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
    () =>
      state.content.blocks
        .map((block, index) => {
          if (typeof block.anchorId !== "string" || block.anchorId.trim().length === 0) {
            return null;
          }

          return {
            id: block.anchorId,
            label: `${index + 1}. ${formatDefinitionLabel(
              getBlockDefinition(block.type, block.variant) ?? {
                typeLabel: block.type,
                label: block.type,
                variant: block.variant ?? "default",
              }
            )} (${block.anchorId})`,
          };
        })
        .filter((item): item is { id: string; label: string } => item !== null),
    [state.content.blocks]
  );

  return (
    <div className="grid gap-6">
      <section data-testid="ProjectEditorContent" className="space-y-6">
        <EditorToolbar
          addBlockGroups={addBlockGroups}
          isPending={isPending}
          serializedContent={serializedContent}
          formAction={formAction}
          onAddBlock={(blockType, variant) =>
            dispatch({ type: "add_block", blockType, variant })
          }
        />

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
        backgroundScenes={backgroundScenes}
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
