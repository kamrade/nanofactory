"use client";

import { useActionState, useEffect, useMemo, useState } from "react";

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
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";
import type { PageBlock } from "@/features/blocks/shared/content";
import { useToast } from "@/hooks/use-toast";
import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIMenu, UIMenuItem, UIMenuLabel } from "@/components/ui/menu";
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

function formatDefinitionLabel(definition: {
  typeLabel: string;
  label: string;
  variant: string;
}) {
  return definition.typeLabel;
}

export function ProjectEditor({ project, assets }: ProjectEditorProps) {
  const { showToast } = useToast();
  const [content, setContent] = useState<PageContent>(project.contentJson);
  const [activeEditorBlockId, setActiveEditorBlockId] = useState<string | null>(null);
  const [pendingVariantSwitch, setPendingVariantSwitch] =
    useState<PendingVariantSwitch | null>(null);
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
  const assetMap = useMemo(() => buildAssetMap(assets), [assets]);
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
    if (saveState.status === "idle" || !saveState.message) {
      return;
    }
    showToast({
      tone: saveState.status === "success" ? "default" : "error",
      title: saveState.message,
    });
  }, [saveState.message, saveState.status, showToast]);

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
    setActiveEditorBlockId((current) => (current === blockId ? null : current));
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

  function handleSelectVariant(
    block: PageBlock,
    definition: BlockVariantDefinition,
    nextVariant: BlockVariant
  ) {
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

  function renderBlockPreview(block: PageBlock) {
    const definition = getBlockDefinition(block.type, block.variant);
    if (!definition) {
      return null;
    }

    const BlockRenderer = definition.Renderer;

    return (
      <BlockRenderer
        block={block}
        assetMap={assetMap}
        theme={{
          muted: "text-text-muted",
          button:
            "inline-flex items-center justify-center rounded-2xl border border-transparent bg-primary-300 px-5 py-3 text-sm font-medium text-text-inverted-main transition hover:bg-primary-200 active:bg-primary-100",
          kicker: "text-text-placeholder",
        }}
      />
    );
  }

  const activeEditorBlock = useMemo(
    () => content.blocks.find((block) => block.id === activeEditorBlockId) ?? null,
    [activeEditorBlockId, content.blocks]
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
    pendingVariantSwitch && pendingVariantSwitch.blockId === activeEditorBlock?.id
      ? pendingVariantSwitch
      : null;
  const activeVariant = activePendingSwitch
    ? activePendingSwitch.nextVariant
    : activeEditorDefinition?.variant;

  return (
    <div className="grid gap-6">
      <section data-testid="ProjectEditorContent" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <UIMenu
              ariaLabel="Add block"
              placement="bottom-start"
              size="sm"
              trigger={
                <UIButton type="button" theme="base" variant="contained" size="sm">
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
                      <span className="text-sm font-medium text-text-main">
                        {definition.label}
                      </span>
                      {definition.description ? (
                        <span className="text-xs leading-5 text-text-muted">
                          {definition.description}
                        </span>
                      ) : null}
                    </UIMenuItem>
                  ))}
                </div>
              ))}
            </UIMenu>

            <form action={formAction} className="flex items-center gap-3">
              <input type="hidden" name="content" value={serializedContent} />
              <UIButton
                type="submit"
                disabled={isPending}
                theme="primary"
                variant="contained"
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

              return (
                <div
                  data-testid="Variant"
                  key={block.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Edit block ${index + 1}: ${formatDefinitionLabel(definition)}`}
                  onClick={() => setActiveEditorBlockId(block.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveEditorBlockId(block.id);
                    }
                  }}
                  className="cursor-pointer hover:ring-2 hover:ring-blue-500 ring-offset-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50"
                >
                  {block.fullBleed ? (
                    <div data-testid="RenderredBlockInEditor">{renderBlockPreview(block)}</div>
                  ) : (
                    <section className="rounded-4xl border border-neutral-line bg-surface px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                      {renderBlockPreview(block)}
                    </section>
                  )}
                </div>
              );
            })
          )}
        </div>

      </section>

      <UISheet
        open={Boolean(activeEditorBlock && activeEditorDefinition)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setActiveEditorBlockId(null);
            setPendingVariantSwitch(null);
          }
        }}
      >
        <UISheetContent
          side="right"
          ariaLabel="Block editor"
          closeOnOverlayClick
          className="p-5 sm:p-6"
        >
          {activeEditorBlock && activeEditorDefinition ? (
            <>
              <UISheetHeader>
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
                          handleSelectVariant(
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
                    onChange={(event) =>
                      handleUpdateBlockFullBleed(activeEditorBlock.id, event.target.checked)
                    }
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

                <activeEditorDefinition.Editor
                  block={activeEditorBlock}
                  assets={assets}
                  definition={activeEditorDefinition}
                  onChange={(nextProps) =>
                    handleUpdateBlockProps(activeEditorBlock.id, nextProps)
                  }
                />
              </div>

              <UISheetFooter className="justify-between border-t border-neutral-line pt-4">
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() => handleDeleteBlock(activeEditorBlock.id)}
                >
                  Delete block
                </UIButton>

                <UISheetClose>
                  <UIButton type="button" size="sm" theme="base" variant="outlined">
                    Close
                  </UIButton>
                </UISheetClose>
              </UISheetFooter>
            </>
          ) : null}
        </UISheetContent>
      </UISheet>

      <UIDivider spacing="md" stripped />

      <section className="py-6">
        <div className="space-y-3">
          <h3 className="ext-lg font-semibold text-text-main">Content shape</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-line bg-surface-alt p-4 text-xs leading-6 text-text-main">
            {serializedContent}
          </pre>
        </div>
      </section>
    </div>
  );
}
