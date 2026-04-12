"use client";

import { useActionState, useEffect, useMemo, useState } from "react";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import {
  type BlockVariant,
  createPageBlock,
  getBlockDefinition,
  getBlockTypes,
  getBlockVariants,
  type SupportedBlockType,
} from "@/lib/editor/blocks";

import { UIDivider } from "@/components/ui/divider";

import {
  type SaveEditorState,
  saveProjectContentAction,
} from "@/app/(protected)/projects/[projectId]/actions";
import {
  applyVariantSwitchToContent,
  createPendingVariantSwitch,
  type PendingVariantSwitch,
  type VariantUndo,
  undoVariantSwitchInContent,
} from "@/components/editor/project-editor-variants";
import { setPreviewDraftContent } from "@/components/editor/preview-draft-store";
import { BlockChrome } from "@/features/blocks/shared/block-chrome";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import type { PageBlock } from "@/features/blocks/shared/content";
import { UIButton } from "@/components/ui/button";
import { UIMenu, UIMenuItem, UIMenuLabel } from "@/components/ui/menu";

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
};

function formatDefinitionLabel(definition: { typeLabel: string; label: string; variant: string }) {
  return definition.typeLabel;
}

function SaveStatus({ state }: { state: SaveEditorState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "text-sm font-medium text-emerald-700"
          : "text-sm font-medium text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

export function ProjectEditor({ project, assets }: ProjectEditorProps) {
  const [content, setContent] = useState<PageContent>(project.contentJson);
  const [pendingVariantSwitch, setPendingVariantSwitch] = useState<PendingVariantSwitch | null>(
    null
  );
  const [lastVariantUndo, setLastVariantUndo] = useState<VariantUndo | null>(null);
  const initialSaveEditorState: SaveEditorState = {
    status: "idle",
    message: "",
  };
  const saveAction = saveProjectContentAction.bind(null, project.id);
  const [saveState, formAction, isPending] = useActionState(
    saveAction,
    initialSaveEditorState
  );

  const serializedContent = useMemo(() => JSON.stringify(content), [content]);
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
    setPreviewDraftContent(content);
  }, [content]);

  useEffect(() => {
    if (!lastVariantUndo) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLastVariantUndo(null);
    }, 10_000);

    return () => window.clearTimeout(timer);
  }, [lastVariantUndo]);

  function handleAddBlock(type: SupportedBlockType, variant: BlockVariant = "default") {
    setContent((currentContent) => ({
      blocks: [...currentContent.blocks, createPageBlock(type, variant)],
    }));
  }

  function handleDeleteBlock(blockId: string) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.filter((block) => block.id !== blockId),
    }));
    setPendingVariantSwitch((current) => (current?.blockId === blockId ? null : current));
    setLastVariantUndo((current) => (current?.blockId === blockId ? null : current));
  }

  function handleUpdateBlockProps(blockId: string, nextProps: Record<string, unknown>) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          props: nextProps,
        };
      }),
    }));
  }

  function handleUpdateBlockFullBleed(blockId: string, nextFullBleed: boolean) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          fullBleed: nextFullBleed,
        };
      }),
    }));
  }

  function applyVariantSwitch(blockId: string, nextDefinition: BlockVariantDefinition) {
    setContent((currentContent) => {
      const result = applyVariantSwitchToContent(
        currentContent,
        blockId,
        nextDefinition,
        getBlockDefinition
      );

      if (result.undo) {
        setLastVariantUndo(result.undo);
      }

      return result.content;
    });
    setPendingVariantSwitch(null);
  }

  function handleSelectVariant(block: PageBlock, definition: BlockVariantDefinition, nextVariant: BlockVariant) {
    const pendingSwitch = createPendingVariantSwitch(
      block,
      definition,
      nextVariant,
      getBlockDefinition
    );

    if (!pendingSwitch) {
      setPendingVariantSwitch(null);
      return;
    }

    if (pendingSwitch.lostKeys.length === 0) {
      applyVariantSwitch(block.id, pendingSwitch.nextDefinition);
      return;
    }

    setPendingVariantSwitch(pendingSwitch);
  }

  function handleConfirmVariantSwitch() {
    if (!pendingVariantSwitch) {
      return;
    }

    applyVariantSwitch(pendingVariantSwitch.blockId, pendingVariantSwitch.nextDefinition);
  }

  function handleCancelVariantSwitch() {
    setPendingVariantSwitch(null);
  }

  function handleUndoVariantSwitch() {
    if (!lastVariantUndo) {
      return;
    }

    setContent((currentContent) => undoVariantSwitchInContent(currentContent, lastVariantUndo));
    setLastVariantUndo(null);
  }

  return (
    <div className="grid gap-6">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-main">Page blocks</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <UIMenu
              ariaLabel="Add block"
              placement="bottom-start"
              size="sm"
              trigger={
                <UIButton
                  type="button"
                  theme="base"
                  variant="contained"
                  size="sm"
                >
                  Add block
                </UIButton>
              }
            >
              {addBlockGroups.map((group) => (
                <div key={group.type} className="grid gap-[2px]">
                  <UIMenuLabel>{group.label}</UIMenuLabel>
                  {group.variants.map((definition) => (
                    <UIMenuItem
                      key={`${definition.type}:${definition.variant}`}
                      onSelect={() => handleAddBlock(definition.type, definition.variant)}
                      className="grid gap-0.5"
                    >
                      <span className="text-sm font-medium text-text-main">{definition.label}</span>
                      {definition.description ? (
                        <span className="text-xs leading-5 text-text-muted">{definition.description}</span>
                      ) : null}
                    </UIMenuItem>
                  ))}
                </div>
              ))}
            </UIMenu>

            <form action={formAction} className="flex items-center gap-3">
            <input type="hidden" name="content" value={serializedContent} />
            <SaveStatus state={saveState} />
            <UIButton
              type="submit"
              disabled={isPending}
              theme="primary" variant="contained"
              size="sm"
            >
              {isPending ? "Saving..." : "Save"}
            </UIButton>
            </form>
          </div>
        </div>

        <div className="grid gap-4">
          {lastVariantUndo ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span>
                Variant switched for {lastVariantUndo.typeLabel}: {lastVariantUndo.fromLabel} →{" "}
                {lastVariantUndo.toLabel}.
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <UIButton
                  type="button"
                  onClick={handleUndoVariantSwitch}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  Undo
                </UIButton>
                <UIButton
                  type="button"
                  onClick={() => setLastVariantUndo(null)}
                  aria-label="Dismiss"
                  title="Dismiss"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-lg font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  ×
                </UIButton>
              </div>
            </div>
          ) : null}

          {content.blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-8 text-sm text-zinc-500">
              No blocks yet. Use `Add block` in the header to choose a block type and
              variant.
            </div>
          ) : (
            content.blocks.map((block, index) => {
              const definition = getBlockDefinition(block.type, block.variant);

              if (!definition) {
                return null;
              }

              const BlockEditor = definition.Editor;
              const variantOptions = getBlockVariants(definition.type);
              const activePending =
                pendingVariantSwitch && pendingVariantSwitch.blockId === block.id
                  ? pendingVariantSwitch
                  : null;
              const selectedVariant = activePending
                ? activePending.nextVariant
                : definition.variant;

              return (
                <BlockChrome
                  key={block.id}
                  index={index}
                  title={formatDefinitionLabel(definition)}
                  meta={`Type: ${definition.typeLabel} · Variant: ${definition.variant} · Layout: ${
                    block.fullBleed ? "Full bleed" : "Contained"
                  }`}
                  onDelete={() => handleDeleteBlock(block.id)}
                  actions={
                    <div className="flex flex-wrap items-center gap-3">
                      {variantOptions.length > 1 ? (
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          <span>Variant</span>
                          <select
                            value={selectedVariant}
                            onChange={(event) =>
                              handleSelectVariant(
                                block,
                                definition,
                                event.target.value as BlockVariant
                              )
                            }
                            className="rounded-xl border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700"
                          >
                            {variantOptions.map((option) => (
                              <option key={`${option.type}:${option.variant}`} value={option.variant}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}

                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                        <input
                          type="checkbox"
                          checked={Boolean(block.fullBleed)}
                          onChange={(event) =>
                            handleUpdateBlockFullBleed(block.id, event.target.checked)
                          }
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-800 focus:ring-zinc-400"
                        />
                        <span>Full bleed</span>
                      </label>
                    </div>
                  }
                >
                  {activePending ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-medium">
                        Switching variant will remove: {activePending.lostLabels.join(", ")}.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <UIButton
                          type="button"
                          onClick={handleConfirmVariantSwitch}
                          className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-400 hover:bg-amber-200"
                        >
                          Switch variant
                        </UIButton>
                        <UIButton
                          type="button"
                          onClick={handleCancelVariantSwitch}
                          className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-100"
                        >
                          Cancel
                        </UIButton>
                      </div>
                    </div>
                  ) : null}
                  <BlockEditor
                    block={block}
                    assets={assets}
                    definition={definition}
                    onChange={(nextProps) => handleUpdateBlockProps(block.id, nextProps)}
                  />
                </BlockChrome>
              );
            })
          )}
        </div>
      </section>

      <UIDivider spacing="md" stripped />

      <section className="py-6">
        <div className="space-y-3">
          <h3 className="ext-lg font-semibold text-text-main">
            Content shape
          </h3>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-line bg-surface-alt p-4 text-xs leading-6 text-text-main">
            {serializedContent}
          </pre>
        </div>
      </section>
    </div>
  );
}
