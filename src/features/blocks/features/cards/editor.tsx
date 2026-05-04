"use client";

import type { BlockEditorProps } from "../../shared/types";
import { UIButton } from "@/components/ui/button";
import { UITextInput } from "@/components/ui/text-input";

type FeatureCardItem = {
  title: string;
  content: string;
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
      };
    })
    .filter((item): item is FeatureCardItem => item !== null);
}

export function FeaturesCardsEditor({ block, onChange }: BlockEditorProps) {
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
      },
    ]);
  }

  function handleRemoveItem(index: number) {
    updateItems(items.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Section title</span>
        <UITextInput
          size="sm"
          value={sectionTitle}
          placeholder="Why teams choose Nanofactory"
          onValueChange={updateSectionTitle}
        />
      </label>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
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

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text-main">Card title</span>
                  <UITextInput
                    size="sm"
                    value={item.title}
                    placeholder={`Feature card ${index + 1}`}
                    onValueChange={(value) => handleUpdateItemTitle(index, value)}
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text-main">Card content</span>
                  <textarea
                    value={item.content}
                    rows={3}
                    placeholder="Card supporting content"
                    onChange={(event) => handleUpdateItemContent(index, event.target.value)}
                    className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50"
                  />
                </label>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
