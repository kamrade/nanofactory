"use client";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";

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
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Section title</span>
        <UITextInput
          size="sm"
          value={sectionTitle}
          onValueChange={(value) => update({ sectionTitle: value })}
          placeholder="Gallery"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Columns</span>
        <UISelect
          ariaLabel="Gallery columns"
          size="sm"
          value={String(columns)}
          onValueChange={(value) => update({ columns: Number(value) })}
          options={[
            { value: "1", label: "1 column", textValue: "1 column" },
            { value: "2", label: "2 columns", textValue: "2 columns" },
            { value: "3", label: "3 columns", textValue: "3 columns" },
            { value: "4", label: "4 columns", textValue: "4 columns" },
          ]}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Image height</span>
        <UISelect
          ariaLabel="Gallery image height mode"
          size="sm"
          value={imageHeightMode}
          onValueChange={(value) => update({ imageHeightMode: value })}
          options={[
            { value: "fixed", label: "Fixed", textValue: "Fixed" },
            { value: "natural", label: "Natural", textValue: "Natural" },
          ]}
        />
      </label>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
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
                <article
                  key={`${block.id}-gallery-item-${index}`}
                  className="grid gap-3 rounded-xl border border-line bg-surface p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-text-main">Item {index + 1}</p>
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

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Entry anchor</span>
                    <UITextInput
                      size="sm"
                      value={item.entryAnchor ?? ""}
                      onValueChange={(value) =>
                        updateItem(index, {
                          ...item,
                          entryAnchor: value.trim().length > 0 ? value : undefined,
                        })
                      }
                      placeholder={effectiveGalleryItemAnchors?.get(index) ?? `gallery-item-${index + 1}`}
                    />
                  </label>

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
                    selectedStateTitle={`Selected image for item ${index + 1}`}
                    layout="grid"
                    compact
                  />

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Title (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.title}
                      onValueChange={(value) => updateItem(index, { ...item, title: value })}
                      placeholder="Item title"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Description (optional)</span>
                    <textarea
                      value={item.description}
                      rows={3}
                      onChange={(event) =>
                        updateItem(index, { ...item, description: event.target.value })
                      }
                      className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
                      placeholder="Item description"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Price (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.price}
                      onValueChange={(value) => updateItem(index, { ...item, price: value })}
                      placeholder="$120"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-text-main">Meta (optional)</span>
                    <UITextInput
                      size="sm"
                      value={item.meta}
                      onValueChange={(value) => updateItem(index, { ...item, meta: value })}
                      placeholder="Limited edition"
                    />
                  </label>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
