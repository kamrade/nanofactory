"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/editor/asset-picker";
import { DebouncedTextArea, DebouncedTextInput } from "../../shared/editor/debounced-text-field";
import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  imageAssetId: string | undefined;
};

function readItems(props: Record<string, unknown>): TestimonialItem[] {
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
        quote: typeof record.quote === "string" ? record.quote : "",
        name: typeof record.name === "string" ? record.name : "",
        role: typeof record.role === "string" ? record.role : "",
        imageAssetId:
          typeof record.imageAssetId === "string" ? record.imageAssetId : undefined,
      };
    })
    .filter((item): item is TestimonialItem => item !== null);
}

export function TestimonialsDefaultEditor({
  block,
  assets,
  onChange,
}: BlockEditorProps) {
  const items = readItems(block.props);

  function update(nextProps: Partial<Record<"items", unknown>>) {
    onChange({
      ...block.props,
      ...nextProps,
    });
  }

  function updateItem(index: number, nextItem: TestimonialItem) {
    update({
      items: items.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    });
  }

  function addItem() {
    update({
      items: [
        ...items,
        {
          quote: "",
          name: "",
          role: "",
          imageAssetId: undefined,
        },
      ],
    });
  }

  function removeItem(index: number) {
    update({
      items: items.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  return (
    <div className="grid gap-5">
      <div className="flex justify-start">
        <UIButton
          type="button"
          size="sm"
          theme="primary"
          variant="contained"
          onClick={addItem}
        >
          Add testimonial
        </UIButton>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No testimonials yet. Add the first quote.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={`${block.id}-testimonial-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-text-main">Testimonial {index + 1}</p>
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </UIButton>
              </div>

              <UIFormRow label="Quote" htmlFor={`testimonials-quote-${index}`} borderless>
                <DebouncedTextArea
                  id={`testimonials-quote-${index}`}
                  size="lg"
                  borderless
                  value={item.quote}
                  rows={4}
                  placeholder="Write a short quote."
                  onCommit={(value) =>
                    updateItem(index, {
                      ...item,
                      quote: value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Name" htmlFor={`testimonials-name-${index}`} borderless>
                <DebouncedTextInput
                  id={`testimonials-name-${index}`}
                  size="sm"
                  borderless
                  value={item.name}
                  placeholder="Jane Doe"
                  onCommit={(value) =>
                    updateItem(index, {
                      ...item,
                      name: value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Role" htmlFor={`testimonials-role-${index}`} borderless>
                <DebouncedTextInput
                  id={`testimonials-role-${index}`}
                  size="sm"
                  borderless
                  value={item.role}
                  placeholder="Founder"
                  onCommit={(value) =>
                    updateItem(index, {
                      ...item,
                      role: value,
                    })
                  }
                />
              </UIFormRow>

              <AssetPicker
                assets={assets}
                selectedAssetId={item.imageAssetId}
                onSelect={(assetId) =>
                  updateItem(index, {
                    ...item,
                    imageAssetId: assetId,
                  })
                }
                onClear={() =>
                  updateItem(index, {
                    ...item,
                    imageAssetId: undefined,
                  })
                }
                emptyMessage="Upload an image in Project assets first."
                clearLabel="Remove portrait"
                selectLabel="Use portrait"
                selectedLabel="Use portrait"
                selectedStateTitle="Selected portrait"
                compact
                layout="grid"
                selectionContainerClassName="grid gap-3 md:grid-cols-2"
                wrapped={false}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
