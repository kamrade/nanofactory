"use client";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import { UIFormRow } from "@/components/ui/form-row";
import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { Card } from "@/components/ui/card";

type GalleryItem = {
  assetId: string | undefined;
  entryAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

type GalleryImageHeightMode = "fixed" | "natural";

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readColumns(props: Record<string, unknown>): 1 | 2 | 3 | 4 {
  const raw = Number(props.columns);
  if (raw === 1 || raw === 2 || raw === 3 || raw === 4) {
    return raw;
  }
  return 3;
}

function readItems(props: Record<string, unknown>): GalleryItem[] {
  if (!Array.isArray(props.items)) {
    return [];
  }

  return props.items
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      return {
        assetId: typeof record.assetId === "string" ? record.assetId : undefined,
        entryAnchor:
          typeof record.entryAnchor === "string"
            ? record.entryAnchor
            : typeof record.imageAnchor === "string"
              ? record.imageAnchor
              : undefined,
        title: typeof record.title === "string" ? record.title : "",
        description: typeof record.description === "string" ? record.description : "",
        price: typeof record.price === "string" ? record.price : "",
        meta: typeof record.meta === "string" ? record.meta : "",
      };
    })
    .filter((item): item is GalleryItem => item !== null);
}

function readImageHeightMode(props: Record<string, unknown>): GalleryImageHeightMode {
  return props.imageHeightMode === "natural" ? "natural" : "fixed";
}

export function GalleryDefaultEditor({
  block,
  assets,
  onChange,
  effectiveGalleryItemAnchors,
}: BlockEditorProps) {
  const sectionTitle = readSectionTitle(block.props);
  const columns = readColumns(block.props);
  const imageHeightMode = readImageHeightMode(block.props);
  const items = readItems(block.props);

  function update(
    next: Partial<Record<"sectionTitle" | "columns" | "imageHeightMode" | "items", unknown>>
  ) {
    onChange({
      ...block.props,
      ...next,
    });
  }

  function updateItem(index: number, nextItem: GalleryItem) {
    update({
      items: items.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    });
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="gallery-section-title" borderless>
          <UITextInput
            id="gallery-section-title"
            size="sm"
            borderless
            value={sectionTitle}
            onValueChange={(value) => update({ sectionTitle: value })}
            placeholder="Gallery"
          />
          </UIFormRow>

          <UIFormRow label="Columns" htmlFor="gallery-columns" borderless>
            <UISelect
              id="gallery-columns"
              ariaLabel="Gallery columns"
              size="sm"
              borderless
              className="w-full"
              value={String(columns)}
              onValueChange={(value) => update({ columns: Number(value) })}
              options={[
                { value: "1", label: "1 column", textValue: "1 column" },
                { value: "2", label: "2 columns", textValue: "2 columns" },
                { value: "3", label: "3 columns", textValue: "3 columns" },
                { value: "4", label: "4 columns", textValue: "4 columns" },
              ]}
            />
          </UIFormRow>

          <UIFormRow label="Image height" htmlFor="gallery-image-height-mode" borderless>
            <UISelect
              id="gallery-image-height-mode"
              ariaLabel="Gallery image height mode"
              size="sm"
              borderless
              className="w-full"
              value={imageHeightMode}
              onValueChange={(value) => update({ imageHeightMode: value })}
              options={[
                { value: "fixed", label: "Fixed", textValue: "Fixed" },
                { value: "natural", label: "Natural", textValue: "Natural" },
              ]}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text-main">Gallery items</p>
        <UIButton
          type="button"
          size="sm"
          theme="base"
          variant="contained"
          onClick={() =>
            update({
              items: [
                ...items,
                { assetId: undefined, entryAnchor: undefined, title: "", description: "", price: "", meta: "" },
              ],
            })
          }
        >
          Add item
        </UIButton>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No items yet. Add the first gallery item.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => {
            return (
              <Card key={`${block.id}-gallery-item-${index}`} >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-text-main">Item {index + 1}</p>
                  <UIButton
                    type="button"
                    size="sm"
                    theme="danger"
                    variant="outlined"
                    onClick={() =>
                      update({
                        items: items.filter((_, itemIndex) => itemIndex !== index),
                      })
                    }
                  >
                    Remove
                  </UIButton>
                </div>

                <UIFormRow label="Entry anchor" htmlFor={`gallery-entry-anchor-${index}`} borderless>
                  <UITextInput
                    id={`gallery-entry-anchor-${index}`}
                    size="sm"
                    borderless
                    value={item.entryAnchor ?? ""}
                    onValueChange={(value) =>
                      updateItem(index, {
                        ...item,
                        entryAnchor: value.trim().length > 0 ? value : undefined,
                      })
                    }
                    placeholder={effectiveGalleryItemAnchors?.get(index) ?? `gallery-item-${index + 1}`}
                  />
                </UIFormRow>

                <AssetPicker
                  assets={assets}
                  selectedAssetId={item.assetId}
                  onSelect={(assetId) =>
                    updateItem(index, {
                      ...item,
                      assetId,
                    })
                  }
                  onClear={() =>
                    updateItem(index, {
                      ...item,
                      assetId: undefined,
                    })
                  }
                  title="Image"
                  description="Choose an image asset for this gallery item."
                  emptyMessage="Upload an image in Project assets first."
                  clearLabel="Remove image"
                  selectLabel="Use image"
                  
                  layout="grid"
                  compact
                />

                <div>
                  <UIFormRow label="Title (optional)" htmlFor={`gallery-item-title-${index}`} borderless>
                    <UITextInput
                      id={`gallery-item-title-${index}`}
                      size="sm"
                      borderless
                      value={item.title}
                      onValueChange={(value) => updateItem(index, { ...item, title: value })}
                      placeholder="Item title"
                    />
                  </UIFormRow>

                  <UIFormRow label="Description (optional)" htmlFor={`gallery-item-description-${index}`} borderless>
                    <div className="min-w-0 flex-1">
                    <textarea
                      id={`gallery-item-description-${index}`}
                      value={item.description}
                      rows={3}
                      onChange={(event) =>
                        updateItem(index, { ...item, description: event.target.value })
                      }
                      className="w-full rounded-xl bg-surface px-3 py-2 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50"
                      placeholder="Item description"
                    />
                    </div>
                  </UIFormRow>

                  <UIFormRow label="Price (optional)" htmlFor={`gallery-item-price-${index}`} borderless>
                    <UITextInput
                      id={`gallery-item-price-${index}`}
                      size="sm"
                      borderless
                      value={item.price}
                      onValueChange={(value) => updateItem(index, { ...item, price: value })}
                      placeholder="$120"
                    />
                  </UIFormRow>

                  <UIFormRow label="Meta (optional)" htmlFor={`gallery-item-meta-${index}`} borderless>
                    <UITextInput
                      id={`gallery-item-meta-${index}`}
                      size="sm"
                      borderless
                      value={item.meta}
                      onValueChange={(value) => updateItem(index, { ...item, meta: value })}
                      placeholder="Limited edition"
                    />
                  </UIFormRow>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
    </div>
  );
}
