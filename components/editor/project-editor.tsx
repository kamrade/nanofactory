"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap, resolveAssetById } from "@/lib/assets/resolution";
import {
  blockDefinitions,
  createPageBlock,
  getBlockDefinition,
  type BlockFieldDefinition,
  type SupportedBlockType,
} from "@/lib/editor/blocks";

import {
  type SaveEditorState,
  saveProjectContentAction,
} from "@/app/(protected)/projects/[projectId]/actions";

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

function readFieldValue(content: PageContent, blockId: string, field: BlockFieldDefinition) {
  const block = content.blocks.find((entry) => entry.id === blockId);

  if (!block) {
    return "";
  }

  const value = block.props[field.key];

  if (field.kind === "string-list") {
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string").join("\n")
      : "";
  }

  return typeof value === "string" ? value : "";
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

  function handleAddBlock(type: SupportedBlockType) {
    setContent((currentContent) => ({
      blocks: [...currentContent.blocks, createPageBlock(type)],
    }));
  }

  function handleDeleteBlock(blockId: string) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.filter((block) => block.id !== blockId),
    }));
  }

  function handleUpdateBlockField(
    blockId: string,
    field: BlockFieldDefinition,
    nextValue: string
  ) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          props: {
            ...block.props,
            [field.key]:
              field.kind === "string-list"
                ? nextValue
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : nextValue,
          },
        };
      }),
    }));
  }

  function handleSelectAsset(blockId: string, assetId?: string) {
    setContent((currentContent) => ({
      blocks: currentContent.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          props: {
            ...block.props,
            imageAssetId: assetId,
          },
        };
      }),
    }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <aside className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-zinc-950">Project metadata</h2>
          <div className="grid gap-2 text-sm text-zinc-600">
            <p>Name: {project.name}</p>
            <p>Slug: {project.slug}</p>
            <p>Status: {project.status}</p>
            <p>Theme: {project.themeKey}</p>
            <p>Blocks: {content.blocks.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Add block
          </h3>
          <div className="grid gap-2">
            {blockDefinitions.map((definition) => (
              <button
                key={definition.type}
                type="button"
                onClick={() => handleAddBlock(definition.type)}
                className="inline-flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                <span>{definition.label}</span>
                <span className="text-zinc-500">Add</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Content shape
          </h3>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
            {serializedContent}
          </pre>
        </div>
      </aside>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Page blocks</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Edit the same `content_json` structure that will later feed the public renderer.
            </p>
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

        <div className="mt-6 grid gap-4">
          {content.blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-8 text-sm text-zinc-500">
              No blocks yet. Add a `hero`, `features`, or `cta` block from the left panel.
            </div>
          ) : (
            content.blocks.map((block, index) => {
              const definition = getBlockDefinition(block.type);
              const selectedAsset = resolveAssetById(block.props.imageAssetId, assetMap);

              if (!definition) {
                return null;
              }

              return (
                <article
                  key={block.id}
                  className="rounded-2xl border border-zinc-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Block {index + 1}
                      </p>
                      <h3 className="text-base font-semibold text-zinc-950">
                        {definition.label}
                      </h3>
                      <p className="text-xs text-zinc-500">Type: {block.type}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {definition.fields.map((field) => {
                      const value = readFieldValue(content, block.id, field);

                      return (
                        <label key={field.key} className="grid gap-1.5 text-sm">
                          <span className="font-medium text-zinc-700">{field.label}</span>
                          {field.kind === "textarea" || field.kind === "string-list" ? (
                            <textarea
                              value={value}
                              rows={field.kind === "string-list" ? 5 : 4}
                              placeholder={field.placeholder}
                              onChange={(event) =>
                                handleUpdateBlockField(block.id, field, event.target.value)
                              }
                              className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              placeholder={field.placeholder}
                              onChange={(event) =>
                                handleUpdateBlockField(block.id, field, event.target.value)
                              }
                              className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                            />
                          )}
                          {field.kind === "string-list" ? (
                            <span className="text-xs text-zinc-500">
                              Enter one list item per line.
                            </span>
                          ) : null}
                        </label>
                      );
                    })}

                    {definition.supportsAssetSelection ? (
                      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-zinc-900">
                            Hero image asset
                          </h4>
                          <p className="text-sm text-zinc-600">
                            Select one of the uploaded project assets. The editor stores only
                            the asset id in `content_json`.
                          </p>
                        </div>

                        {assets.length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            Upload an asset in the project assets panel below to use it in this
                            block.
                          </p>
                        ) : (
                          <div className="grid gap-3">
                            {assets.map((asset) => {
                              const isSelected = block.props.imageAssetId === asset.id;

                              return (
                                <article
                                  key={asset.id}
                                  className={
                                    isSelected
                                      ? "grid gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3"
                                      : "grid gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
                                  }
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-zinc-900">
                                        {asset.originalFilename}
                                      </p>
                                      <p className="text-xs text-zinc-500">{asset.mimeType}</p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleSelectAsset(block.id, asset.id)}
                                      className={
                                        isSelected
                                          ? "inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                                          : "inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
                                      }
                                    >
                                      {isSelected ? "Selected" : "Use"}
                                    </button>
                                  </div>

                                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                                    <Image
                                      src={asset.publicUrl}
                                      alt={asset.alt ?? asset.originalFilename}
                                      width={640}
                                      height={320}
                                      unoptimized
                                      className="h-40 w-full object-cover"
                                    />
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        )}

                        {selectedAsset ? (
                          <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                            <p className="text-sm font-medium text-zinc-900">
                              Selected asset preview
                            </p>
                            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                              <Image
                                src={selectedAsset.publicUrl}
                                alt={selectedAsset.alt ?? selectedAsset.originalFilename}
                                width={960}
                                height={448}
                                unoptimized
                                className="h-56 w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600">
                              <span>Asset ID: {selectedAsset.id}</span>
                              <button
                                type="button"
                                onClick={() => handleSelectAsset(block.id, undefined)}
                                className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
                              >
                                Clear image
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
