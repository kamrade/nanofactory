"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/editor/asset-picker";
import { DebouncedTextArea, DebouncedTextInput } from "../../shared/editor/debounced-text-field";
import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIFormRow } from "@/components/ui/form-row";
import { Card } from "@/components/ui/card";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readItems(props: Record<string, unknown>): FeatureCardItem[] {
  if (!Array.isArray(props.items)) {
    return [];
  }

  return props.items
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          content: "",
          imageAssetId: undefined,
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const title =
        typeof (item as { title?: unknown }).title === "string"
          ? (item as { title: string }).title
          : "";
      const content =
        typeof (item as { content?: unknown }).content === "string"
          ? (item as { content: string }).content
          : "";

      return {
        title,
        content,
        imageAssetId:
          typeof (item as { imageAssetId?: unknown }).imageAssetId === "string"
            ? (item as { imageAssetId: string }).imageAssetId
            : undefined,
      };
    })
    .filter((item): item is FeatureCardItem => item !== null);
}

export function FeaturesCardsEditor({ block, assets, onChange }: BlockEditorProps) {
  const sectionTitle = readSectionTitle(block.props);
  const animate = block.props.animate !== false;
  const items = readItems(block.props);

  function updateSectionTitle(nextValue: string) {
    onChange({
      ...block.props,
      sectionTitle: nextValue,
    });
  }

  function updateAnimate(nextValue: boolean) {
    onChange({
      ...block.props,
      animate: nextValue,
    });
  }

  function updateItems(nextItems: FeatureCardItem[]) {
    onChange({
      ...block.props,
      items: nextItems,
    });
  }

  function handleUpdateItemTitle(index: number, nextValue: string) {
    updateItems(
      items.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              title: nextValue,
            }
          : item
      )
    );
  }

  function handleUpdateItemContent(index: number, nextValue: string) {
    updateItems(
      items.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              content: nextValue,
            }
          : item
      )
    );
  }

  function handleAddItem() {
    updateItems([
      ...items,
      {
        title: "",
        content: "",
        imageAssetId: undefined,
      },
    ]);
  }

  function handleRemoveItem(index: number) {
    updateItems(items.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleUpdateItemImage(index: number, assetId?: string) {
    updateItems(
      items.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              imageAssetId: assetId,
            }
          : item
      )
    );
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="features-cards-section-title" borderless>
            <DebouncedTextInput
              id="features-cards-section-title"
              size="sm"
              borderless
              value={sectionTitle}
              placeholder="Why teams choose Nanofactory"
              onCommit={updateSectionTitle}
            />
          </UIFormRow>

          <UIFormRow label="Animate title" borderless>
            <UICheckbox
              checked={animate}
              onChange={(event) => updateAnimate(event.currentTarget.checked)}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-text-main">Cards</h4>
          <p className="text-sm text-text-muted">
            Edit each feature card separately. Keep the titles short and scannable.
          </p>
        </div>

        <UIButton
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:border-text-placeholder hover:bg-surface-alt"
        >
          Add card
        </UIButton>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No cards yet. Add the first feature card.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={`${block.id}-card-${index}-${item.title}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-text-main">Card {index + 1}</p>
                <UIButton
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="inline-flex items-center justify-center rounded-2xl border border-danger-line bg-danger-100 px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger-200"
                >
                  Remove
                </UIButton>
              </div>

              <UIFormRow label="Card title" htmlFor={`features-card-title-${index}`} borderless>
                <DebouncedTextInput
                  id={`features-card-title-${index}`}
                  size="sm"
                  borderless
                  value={item.title}
                  placeholder={`Feature card ${index + 1}`}
                  onCommit={(value) => handleUpdateItemTitle(index, value)}
                />
              </UIFormRow>

              <UIFormRow label="Card content" htmlFor={`features-card-content-${index}`} borderless>
                <DebouncedTextArea
                  id={`features-card-content-${index}`}
                  size="lg"
                  borderless
                  value={item.content}
                  rows={3}
                  placeholder="Card supporting content"
                  onCommit={(value) => handleUpdateItemContent(index, value)}
                />
              </UIFormRow>

              <AssetPicker
                assets={assets}
                selectedAssetId={item.imageAssetId}
                onSelect={(assetId) => handleUpdateItemImage(index, assetId)}
                onClear={() => handleUpdateItemImage(index, undefined)}
                title="Card image"
                description="Optional small image for this card."
                emptyMessage="Upload an image in Project assets first."
                clearLabel="Remove image"
                selectLabel="Use image"
                compact
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
