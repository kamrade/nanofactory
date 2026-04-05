"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

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
  const [isAddBlockMenuOpen, setIsAddBlockMenuOpen] = useState(false);
  const [selectedAddBlockType, setSelectedAddBlockType] = useState<SupportedBlockType | null>(
    null
  );
  const [pendingVariantSwitch, setPendingVariantSwitch] = useState<PendingVariantSwitch | null>(
    null
  );
  const [lastVariantUndo, setLastVariantUndo] = useState<VariantUndo | null>(null);
  const initialSaveEditorState: SaveEditorState = {
    status: "idle",
    message: "",
  };
  const addBlockMenuRef = useRef<HTMLDivElement>(null);
  const saveAction = saveProjectContentAction.bind(null, project.id);
  const [saveState, formAction, isPending] = useActionState(
    saveAction,
    initialSaveEditorState
  );

  const serializedContent = useMemo(() => JSON.stringify(content), [content]);
  const blockTypes = useMemo(() => getBlockTypes(), []);
  const selectedBlockVariants = useMemo(
    () => (selectedAddBlockType ? getBlockVariants(selectedAddBlockType) : []),
    [selectedAddBlockType]
  );

  useEffect(() => {
    setPreviewDraftContent(content);
  }, [content]);

  useEffect(() => {
    if (!isAddBlockMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!addBlockMenuRef.current?.contains(event.target as Node)) {
        setIsAddBlockMenuOpen(false);
        setSelectedAddBlockType(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAddBlockMenuOpen(false);
        setSelectedAddBlockType(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAddBlockMenuOpen]);

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
    setIsAddBlockMenuOpen(false);
    setSelectedAddBlockType(null);
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
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Page blocks</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Edit the same `content_json` structure that will later feed the public renderer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div ref={addBlockMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAddBlockMenuOpen((current) => !current)}
                aria-expanded={isAddBlockMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                Add block
              </button>

              {isAddBlockMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-10 mt-2 grid min-w-72 gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg"
                >
                  {selectedAddBlockType ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedAddBlockType(null)}
                        className="inline-flex items-center rounded-2xl px-4 py-2 text-left text-sm font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                      >
                        Back
                      </button>

                      {selectedBlockVariants.map((definition) => (
                        <button
                          key={`${definition.type}:${definition.variant}`}
                          type="button"
                          onClick={() =>
                            handleAddBlock(definition.type, definition.variant)
                          }
                          className="grid gap-1 rounded-2xl px-4 py-3 text-left transition hover:bg-zinc-50"
                        >
                          <span className="text-sm font-medium text-zinc-900">
                            {definition.label}
                          </span>
                          {definition.description ? (
                            <span className="text-xs leading-5 text-zinc-500">
                              {definition.description}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </>
                  ) : (
                    blockTypes.map((blockType) => (
                      <button
                        key={blockType.type}
                        type="button"
                        onClick={() => setSelectedAddBlockType(blockType.type)}
                        className="inline-flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                      >
                        <span>{blockType.label}</span>
                        <span className="text-zinc-500">Choose variant</span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            <form action={formAction} className="flex items-center gap-3">
            <input type="hidden" name="content" value={serializedContent} />
            <SaveStatus state={saveState} />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {lastVariantUndo ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span>
                Variant switched for {lastVariantUndo.typeLabel}: {lastVariantUndo.fromLabel} →{" "}
                {lastVariantUndo.toLabel}.
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndoVariantSwitch}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => setLastVariantUndo(null)}
                  aria-label="Dismiss"
                  title="Dismiss"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-lg font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  ×
                </button>
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
                  meta={`Type: ${definition.typeLabel} · Variant: ${definition.variant}`}
                  onDelete={() => handleDeleteBlock(block.id)}
                  actions={
                    variantOptions.length > 1 ? (
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
                    ) : null
                  }
                >
                  {activePending ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-medium">
                        Switching variant will remove: {activePending.lostLabels.join(", ")}.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleConfirmVariantSwitch}
                          className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-400 hover:bg-amber-200"
                        >
                          Switch variant
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelVariantSwitch}
                          className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-100"
                        >
                          Cancel
                        </button>
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

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Content shape
          </h3>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
            {serializedContent}
          </pre>
        </div>
      </section>
    </div>
  );
}
