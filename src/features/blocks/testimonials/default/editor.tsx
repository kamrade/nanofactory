"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/editor/asset-picker";
import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UITextArea } from "@/components/ui/textarea";
import { UITextInput } from "@/components/ui/text-input";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  imageAssetId: string | undefined;
};

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readSubtitle(props: Record<string, unknown>) {
  return typeof props.subtitle === "string" ? props.subtitle : "";
}

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
  const sectionTitle = readSectionTitle(block.props);
  const subtitle = readSubtitle(block.props);
  const items = readItems(block.props);

  function update(nextProps: Partial<Record<"sectionTitle" | "subtitle" | "items", unknown>>) {
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
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="testimonials-section-title" borderless>
            <UITextInput
              id="testimonials-section-title"
              size="sm"
              borderless
              value={sectionTitle}
              placeholder="What people say"
              onValueChange={(value) => update({ sectionTitle: value })}
            />
          </UIFormRow>

          <UIFormRow label="Subtitle" htmlFor="testimonials-subtitle" borderless>
            <UITextArea
              id="testimonials-subtitle"
              size="lg"
              borderless
              value={subtitle}
              rows={3}
              placeholder="Add a short supporting line under the title."
              onChange={(event) => update({ subtitle: event.target.value })}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-text-main">Testimonials</h4>
          <p className="text-sm text-text-muted">
            Keep each quote short. Name, role, and an optional portrait are enough.
          </p>
        </div>

        <UIButton
          type="button"
          size="sm"
          theme="base"
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
                <UITextArea
                  id={`testimonials-quote-${index}`}
                  size="lg"
                  borderless
                  value={item.quote}
                  rows={4}
                  placeholder="Write a short quote."
                  onChange={(event) =>
                    updateItem(index, {
                      ...item,
                      quote: event.target.value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Name" htmlFor={`testimonials-name-${index}`} borderless>
                <UITextInput
                  id={`testimonials-name-${index}`}
                  size="sm"
                  borderless
                  value={item.name}
                  placeholder="Jane Doe"
                  onValueChange={(value) =>
                    updateItem(index, {
                      ...item,
                      name: value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Role" htmlFor={`testimonials-role-${index}`} borderless>
                <UITextInput
                  id={`testimonials-role-${index}`}
                  size="sm"
                  borderless
                  value={item.role}
                  placeholder="Founder"
                  onValueChange={(value) =>
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
                title="Portrait image"
                description="Optional square portrait for this testimonial."
                emptyMessage="Upload an image in Project assets first."
                clearLabel="Remove portrait"
                selectLabel="Use portrait"
                selectedLabel="Use portrait"
                selectedStateTitle="Selected portrait"
                compact
                layout="grid"
                selectionContainerClassName="grid gap-3 md:grid-cols-2"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
