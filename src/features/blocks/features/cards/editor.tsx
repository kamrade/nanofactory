"use client";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { EditorFieldRow } from "@/components/editor/editor-field-row";
import { UIButton } from "@/components/ui/button";
import { UITextInput } from "@/components/ui/text-input";
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
  const items = readItems(block.props);

  function updateSectionTitle(nextValue: string) {
    onChange({
      ...block.props,
      sectionTitle: nextValue,
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
        <EditorFieldRow label="Section title" htmlFor="features-cards-section-title">
          <UITextInput
            id="features-cards-section-title"
            size="sm"
            value={sectionTitle}
            placeholder="Why teams choose Nanofactory"
            onValueChange={updateSectionTitle}
          />
        </EditorFieldRow>
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
            <article
              key={`${block.id}-card-${index}-${item.title}`}
              className="grid gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-text-main">Card {index + 1}</p>
                <UIButton
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="inline-flex items-center justify-center rounded-2xl border border-danger-line bg-danger-100 px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger-200"
                >
                  Remove
                </UIButton>
              </div>

              <EditorFieldRow label="Card title" htmlFor={`features-card-title-${index}`}>
                <UITextInput
                  id={`features-card-title-${index}`}
                  size="sm"
                  value={item.title}
                  placeholder={`Feature card ${index + 1}`}
                  onValueChange={(value) => handleUpdateItemTitle(index, value)}
                />
              </EditorFieldRow>

              <div className="grid gap-1.5 md:flex md:items-start md:gap-4">
                <span className="pt-1 text-sm font-medium text-text-main md:w-44 md:shrink-0">
                  Card content
                </span>
                <div className="min-w-0 flex-1">
                <textarea
                  value={item.content}
                  rows={3}
                  placeholder="Card supporting content"
                  onChange={(event) => handleUpdateItemContent(index, event.target.value)}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50"
                />
                </div>
              </div>

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
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
