"use client";

import { UIButton } from "@/components/ui/button";
import { UITextInput } from "@/components/ui/text-input";
import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import {
  readProjectsGalleryProps,
  type ProjectsGalleryEntryItem,
  type ProjectsGalleryProjectItem,
} from "./model";

function buildFallbackProjectAnchor(index: number) {
  return `project-${index + 1}`;
}

function buildFallbackGalleryAnchor(index: number) {
  return `gallery-${index + 1}`;
}

function buildFallbackImageAnchor(projectAnchor: string, galleryAnchor: string, index: number) {
  return `${projectAnchor}-${galleryAnchor}-item-${index + 1}`;
}

export function ProjectsGalleryDefaultEditor({ block, assets, onChange }: BlockEditorProps) {
  const props = readProjectsGalleryProps(block.props);

  function update(nextProps: Partial<Record<"sectionTitle" | "galleryAnchor" | "items", unknown>>) {
    onChange({
      ...block.props,
      ...nextProps,
    });
  }

  function updateProjectItem(index: number, nextItem: ProjectsGalleryProjectItem) {
    update({
      items: props.items.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    });
  }

  function updateGalleryItem(
    projectIndex: number,
    imageIndex: number,
    nextImageItem: ProjectsGalleryEntryItem
  ) {
    const projectItem = props.items[projectIndex];
    if (!projectItem) {
      return;
    }

    updateProjectItem(projectIndex, {
      ...projectItem,
      galleryItems: projectItem.galleryItems.map((item, itemIdx) =>
        itemIdx === imageIndex ? nextImageItem : item
      ),
    });
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Section title</span>
        <UITextInput
          size="sm"
          value={props.sectionTitle}
          onValueChange={(value) => update({ sectionTitle: value })}
          placeholder="Projects"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Gallery anchor</span>
        <UITextInput
          size="sm"
          value={props.galleryAnchor ?? ""}
          onValueChange={(value) =>
            update({ galleryAnchor: value.trim().length > 0 ? value : undefined })
          }
          placeholder="projects"
        />
      </label>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-text-main">Projects</p>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            onClick={() =>
              update({
                items: [
                  ...props.items,
                  {
                    projectAnchor: undefined,
                    galleryAnchor: undefined,
                    title: "",
                    description: "",
                    descriptionMd: "",
                    price: "",
                    meta: "",
                    imageAssetId: undefined,
                    galleryItems: [],
                  },
                ],
              })
            }
          >
            Add project
          </UIButton>
        </div>

        {props.items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
            No projects yet. Add the first project card.
          </p>
        ) : (
          <div className="grid gap-3">
            {props.items.map((item, projectIndex) => {
              const fallbackProjectAnchor = buildFallbackProjectAnchor(projectIndex);
              const fallbackGalleryAnchor = buildFallbackGalleryAnchor(projectIndex);
              const effectiveProjectAnchor = item.projectAnchor ?? fallbackProjectAnchor;
              const effectiveGalleryAnchor = item.galleryAnchor ?? fallbackGalleryAnchor;

              return (
                <article
                  key={`${block.id}-project-item-${projectIndex}`}
                  className="grid gap-3 rounded-xl border border-line bg-surface p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-text-main">Project {projectIndex + 1}</p>
                    <UIButton
                      type="button"
                      size="sm"
                      theme="danger"
                      variant="outlined"
                      onClick={() =>
                        update({
                          items: props.items.filter((_, idx) => idx !== projectIndex),
                        })
                      }
                    >
                      Remove
                    </UIButton>
                  </div>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Project anchor</span>
                    <UITextInput
                      size="sm"
                      value={item.projectAnchor ?? ""}
                      onValueChange={(value) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          projectAnchor: value.trim().length > 0 ? value : undefined,
                        })
                      }
                      placeholder={fallbackProjectAnchor}
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Nested gallery anchor</span>
                    <UITextInput
                      size="sm"
                      value={item.galleryAnchor ?? ""}
                      onValueChange={(value) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          galleryAnchor: value.trim().length > 0 ? value : undefined,
                        })
                      }
                      placeholder={fallbackGalleryAnchor}
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Title (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.title}
                      onValueChange={(value) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          title: value,
                        })
                      }
                      placeholder="Project title"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Description (plain, optional)</span>
                    <textarea
                      value={item.description}
                      rows={3}
                      onChange={(event) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          description: event.target.value,
                        })
                      }
                      className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
                      placeholder="Project card description"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Description (Markdown, optional)</span>
                    <textarea
                      value={item.descriptionMd}
                      rows={5}
                      onChange={(event) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          descriptionMd: event.target.value,
                        })
                      }
                      className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
                      placeholder="Project details in markdown for inside page"
                    />
                    <span className="text-xs text-text-muted">
                      Supports basic markdown: headings (<code>#</code>), lists, links, quotes, and inline/code blocks.
                    </span>
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Price (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.price}
                      onValueChange={(value) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          price: value,
                        })
                      }
                      placeholder="$120"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Meta (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.meta}
                      onValueChange={(value) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          meta: value,
                        })
                      }
                      placeholder="Limited edition"
                    />
                  </label>

                  <AssetPicker
                    assets={assets}
                    selectedAssetId={item.imageAssetId}
                    onSelect={(assetId) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        imageAssetId: assetId,
                      })
                    }
                    onClear={() =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        imageAssetId: undefined,
                      })
                    }
                    title="Project cover image"
                    description="Image for project card preview."
                    emptyMessage="Upload an image in Project assets first."
                    clearLabel="Remove image"
                    selectLabel="Use image"
                    layout="grid"
                    compact
                  />

                  <div className="grid gap-3 rounded-xl border border-line bg-surface-alt p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-main">Nested gallery items</p>
                      <div className="flex items-center gap-2">
                        <UIButton
                          type="button"
                          size="sm"
                          theme="base"
                          variant="outlined"
                          onClick={() =>
                            updateProjectItem(projectIndex, {
                              ...item,
                              galleryItems: [
                                ...item.galleryItems,
                                {
                                  kind: "markdown",
                                  assetId: undefined,
                                  imageAnchor: undefined,
                                  title: "",
                                  description: "",
                                  contentMd: "",
                                  price: "",
                                  meta: "",
                                },
                              ],
                            })
                          }
                        >
                          Add markdown
                        </UIButton>
                        <UIButton
                          type="button"
                          size="sm"
                          theme="base"
                          variant="contained"
                          onClick={() =>
                            updateProjectItem(projectIndex, {
                              ...item,
                              galleryItems: [
                                ...item.galleryItems,
                                {
                                  kind: "image",
                                  assetId: undefined,
                                  imageAnchor: undefined,
                                  title: "",
                                  description: "",
                                  contentMd: "",
                                  price: "",
                                  meta: "",
                                },
                              ],
                            })
                          }
                        >
                          Add image
                        </UIButton>
                      </div>
                    </div>

                    {item.galleryItems.length === 0 ? (
                      <p className="text-sm text-text-muted">No nested gallery items yet.</p>
                    ) : (
                      <div className="grid gap-3">
                        {item.galleryItems.map((galleryItem, imageIndex) => (
                          <article
                            key={`${block.id}-project-${projectIndex}-image-${imageIndex}`}
                            className="grid gap-2 rounded-lg border border-line bg-surface p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-text-main">
                                {galleryItem.kind === "markdown" ? "Markdown" : "Image"} {imageIndex + 1}
                              </p>
                              <UIButton
                                type="button"
                                size="sm"
                                theme="danger"
                                variant="outlined"
                                onClick={() =>
                                  updateProjectItem(projectIndex, {
                                    ...item,
                                    galleryItems: item.galleryItems.filter(
                                      (_, idx) => idx !== imageIndex
                                    ),
                                  })
                                }
                              >
                                Remove
                              </UIButton>
                            </div>

                            <label className="grid gap-1 text-sm">
                              <span className="font-medium text-text-main">Item anchor</span>
                              <UITextInput
                                size="sm"
                                value={galleryItem.imageAnchor ?? ""}
                                onValueChange={(value) =>
                                  updateGalleryItem(projectIndex, imageIndex, {
                                    ...galleryItem,
                                    imageAnchor:
                                      value.trim().length > 0 ? value : undefined,
                                  })
                                }
                                placeholder={buildFallbackImageAnchor(
                                  effectiveProjectAnchor,
                                  effectiveGalleryAnchor,
                                  imageIndex
                                )}
                              />
                            </label>

                            {galleryItem.kind === "image" ? (
                              <AssetPicker
                                assets={assets}
                                selectedAssetId={galleryItem.assetId}
                                onSelect={(assetId) =>
                                  updateGalleryItem(projectIndex, imageIndex, {
                                    ...galleryItem,
                                    assetId,
                                  })
                                }
                                onClear={() =>
                                  updateGalleryItem(projectIndex, imageIndex, {
                                    ...galleryItem,
                                    assetId: undefined,
                                  })
                                }
                                title="Image"
                                description="Choose image for nested gallery item."
                                emptyMessage="Upload an image in Project assets first."
                                clearLabel="Remove image"
                                selectLabel="Use image"
                                layout="grid"
                                compact
                              />
                            ) : (
                              <label className="grid gap-1 text-sm">
                                <span className="font-medium text-text-main">Markdown content</span>
                                <textarea
                                  value={galleryItem.contentMd}
                                  rows={6}
                                  onChange={(event) =>
                                    updateGalleryItem(projectIndex, imageIndex, {
                                      ...galleryItem,
                                      contentMd: event.target.value,
                                    })
                                  }
                                  className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
                                  placeholder="Markdown for this nested item"
                                />
                              </label>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
