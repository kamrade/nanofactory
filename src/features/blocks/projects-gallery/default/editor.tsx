"use client";

import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/editor/asset-picker";
import { DebouncedTextArea as UITextArea, DebouncedTextInput as UITextInput } from "../../shared/editor/debounced-text-field";
import {
  addImageEntry,
  addMarkdownEntry,
  removeEntry,
  updateEntry,
} from "./editor-operations";
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

function buildFallbackEntryAnchor(projectAnchor: string, galleryAnchor: string, index: number) {
  return `${projectAnchor}-${galleryAnchor}-item-${index + 1}`;
}

export function ProjectsGalleryDefaultEditor({ block, assets, onChange }: BlockEditorProps) {
  const props = readProjectsGalleryProps(block.props);

  function update(
    nextProps: Partial<Record<"sectionTitle" | "animate" | "galleryAnchor" | "items", unknown>>
  ) {
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
    entryIndex: number,
    nextEntryItem: ProjectsGalleryEntryItem
  ) {
    const projectItem = props.items[projectIndex];
    if (!projectItem) {
      return;
    }

    updateProjectItem(projectIndex, updateEntry(projectItem, entryIndex, nextEntryItem));
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="projects-gallery-section-title" borderless>
            <UITextInput
              id="projects-gallery-section-title"
              size="sm"
              borderless
              value={props.sectionTitle}
              onValueChange={(value) => update({ sectionTitle: value })}
              placeholder="Projects"
            />
          </UIFormRow>

          <UIFormRow label="Animate title" borderless>
            <UICheckbox
              checked={props.animate}
              onChange={(event) => update({ animate: event.currentTarget.checked })}
            />
          </UIFormRow>

          <UIFormRow label="Gallery anchor" htmlFor="projects-gallery-gallery-anchor" borderless>
            <UITextInput
              id="projects-gallery-gallery-anchor"
              size="sm"
              borderless
              value={props.galleryAnchor ?? ""}
              onValueChange={(value) =>
                update({ galleryAnchor: value.trim().length > 0 ? value : undefined })
              }
              placeholder="projects"
            />
          </UIFormRow>
        </div>
      </Card>

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
              <Card key={`${block.id}-project-item-${projectIndex}`} >
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

                <UIFormRow
                  label="Project anchor"
                  htmlFor={`projects-gallery-project-anchor-${projectIndex}`}
                  borderless
                >
                  <UITextInput
                    id={`projects-gallery-project-anchor-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.projectAnchor ?? ""}
                    onValueChange={(value) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        projectAnchor: value.trim().length > 0 ? value : undefined,
                      })
                    }
                    placeholder={fallbackProjectAnchor}
                  />
                </UIFormRow>

                <UIFormRow
                  label="Nested gallery anchor"
                  htmlFor={`projects-gallery-nested-gallery-anchor-${projectIndex}`}
                  borderless
                >
                  <UITextInput
                    id={`projects-gallery-nested-gallery-anchor-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.galleryAnchor ?? ""}
                    onValueChange={(value) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        galleryAnchor: value.trim().length > 0 ? value : undefined,
                      })
                    }
                    placeholder={fallbackGalleryAnchor}
                  />
                </UIFormRow>

                <UIFormRow
                  label="Title (optional)"
                  htmlFor={`projects-gallery-title-${projectIndex}`}
                  borderless
                >
                  <UITextInput
                    id={`projects-gallery-title-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.title}
                    onValueChange={(value) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        title: value,
                      })
                    }
                    placeholder="Project title"
                  />
                </UIFormRow>

                <UIFormRow
                  label="Description (plain, optional)"
                  htmlFor={`projects-gallery-description-${projectIndex}`}
                  borderless
                >
                  <UITextArea
                    id={`projects-gallery-description-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.description}
                    rows={3}
                    onChange={(event) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        description: event.target.value,
                      })
                    }
                    placeholder="Project card description"
                  />
                </UIFormRow>

                <UIFormRow
                  label="Description (Markdown, optional)"
                  htmlFor={`projects-gallery-description-md-${projectIndex}`}
                  borderless
                >
                  <div className="grid gap-1.5">
                    <UITextArea
                      id={`projects-gallery-description-md-${projectIndex}`}
                      size="sm"
                      borderless
                      value={item.descriptionMd}
                      rows={5}
                      onChange={(event) =>
                        updateProjectItem(projectIndex, {
                          ...item,
                          descriptionMd: event.target.value,
                        })
                      }
                      placeholder="Project details in markdown for inside page"
                    />
                    <span className="text-xs text-text-muted">
                      Supports basic markdown: headings (<code>#</code>), lists, links, quotes, and inline/code blocks.
                    </span>
                  </div>
                </UIFormRow>

                <UIFormRow
                  label="Price (optional)"
                  htmlFor={`projects-gallery-price-${projectIndex}`}
                  borderless
                >
                  <UITextInput
                    id={`projects-gallery-price-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.price}
                    onValueChange={(value) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        price: value,
                      })
                    }
                    placeholder="$120"
                  />
                </UIFormRow>

                <UIFormRow
                  label="Meta (optional)"
                  htmlFor={`projects-gallery-meta-${projectIndex}`}
                  borderless
                >
                  <UITextInput
                    id={`projects-gallery-meta-${projectIndex}`}
                    size="sm"
                    borderless
                    value={item.meta}
                    onValueChange={(value) =>
                      updateProjectItem(projectIndex, {
                        ...item,
                        meta: value,
                      })
                    }
                    placeholder="Limited edition"
                  />
                </UIFormRow>

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

                <div className="grid gap-3 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-md font-bold text-text-main">Nested gallery entries</p>
                    <div className="flex items-center gap-2">
                      <UIButton
                        type="button"
                        size="sm"
                        theme="base"
                        variant="outlined"
                        onClick={() =>
                          updateProjectItem(projectIndex, addMarkdownEntry(item))
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
                          updateProjectItem(projectIndex, addImageEntry(item))
                        }
                      >
                        Add entry (image)
                      </UIButton>
                    </div>
                  </div>

                  {item.galleryItems.length === 0 ? (
                    <p className="text-sm text-text-muted">No nested gallery items yet.</p>
                  ) : (
                    <div className="grid gap-3">
                      {item.galleryItems.map((galleryItem, entryIndex) => (
                        <Card key={`${block.id}-project-${projectIndex}-entry-${entryIndex}`}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-text-main">
                              {galleryItem.kind === "markdown" ? "Markdown entry" : "Image entry"} {entryIndex + 1}
                            </p>
                            <UIButton
                              type="button"
                              size="sm"
                              theme="danger"
                              variant="outlined"
                              onClick={() =>
                                updateProjectItem(projectIndex, removeEntry(item, entryIndex))
                              }
                            >
                              Remove
                            </UIButton>
                          </div>

                          <UIFormRow
                            label="Item anchor"
                            htmlFor={`projects-gallery-entry-anchor-${projectIndex}-${entryIndex}`}
                            borderless
                          >
                            <UITextInput
                              id={`projects-gallery-entry-anchor-${projectIndex}-${entryIndex}`}
                              size="sm"
                              borderless
                              value={galleryItem.entryAnchor ?? ""}
                              onValueChange={(value) =>
                                updateGalleryItem(projectIndex, entryIndex, {
                                  ...galleryItem,
                                  entryAnchor:
                                    value.trim().length > 0 ? value : undefined,
                                })
                              }
                                placeholder={buildFallbackEntryAnchor(
                                  effectiveProjectAnchor,
                                  effectiveGalleryAnchor,
                                  entryIndex
                                )}
                              />
                          </UIFormRow>

                          {galleryItem.kind === "image" ? (
                            <AssetPicker
                              assets={assets}
                              selectedAssetId={galleryItem.assetId}
                              onSelect={(assetId) =>
                                updateGalleryItem(projectIndex, entryIndex, {
                                  ...galleryItem,
                                  assetId,
                                })
                              }
                              onClear={() =>
                                updateGalleryItem(projectIndex, entryIndex, {
                                  ...galleryItem,
                                  assetId: undefined,
                                })
                              }
                              title="Entry image"
                              description="Choose image for nested gallery entry."
                              emptyMessage="Upload an image in Project assets first."
                              clearLabel="Remove image"
                              selectLabel="Use image"
                              layout="grid"
                              compact
                            />
                          ) : (
                            <UIFormRow
                              label="Markdown content"
                              htmlFor={`projects-gallery-entry-content-${projectIndex}-${entryIndex}`}
                              borderless
                            >
                              <UITextArea
                                id={`projects-gallery-entry-content-${projectIndex}-${entryIndex}`}
                                size="sm"
                                borderless
                                value={galleryItem.contentMd}
                                rows={6}
                                onChange={(event) =>
                                  updateGalleryItem(projectIndex, entryIndex, {
                                    ...galleryItem,
                                    contentMd: event.target.value,
                                  })
                                }
                                placeholder="Markdown for this nested item"
                              />
                            </UIFormRow>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
