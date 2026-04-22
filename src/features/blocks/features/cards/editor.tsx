"use client";

import type { BlockEditorProps } from "../../shared/types";
import { UIButton } from "@/components/ui/button";

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readItems(props: Record<string, unknown>) {
  return Array.isArray(props.items)
    ? props.items.map((item) => (typeof item === "string" ? item : ""))
    : [];
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

  function updateItems(nextItems: string[]) {
    onChange({
      ...block.props,
      items: nextItems,
    });
  }

  function handleUpdateItem(index: number, nextValue: string) {
    updateItems(items.map((item, currentIndex) => (currentIndex === index ? nextValue : item)));
  }

  function handleAddItem() {
    updateItems([...items, ""]);
  }

  function handleRemoveItem(index: number) {
    updateItems(items.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Section title</span>
        <input
          type="text"
          value={sectionTitle}
          placeholder="Why teams choose Nanofactory"
          onChange={(event) => updateSectionTitle(event.target.value)}
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
        />
      </label>

      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-zinc-900">Cards</h4>
            <p className="text-sm text-zinc-600">
              Edit each feature card separately. Keep the titles short and scannable.
            </p>
          </div>

          <UIButton
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Add card
          </UIButton>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-500">
            No cards yet. Add the first feature card.
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item, index) => (
              <article
                key={`${block.id}-card-${index}`}
                className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-900">Card {index + 1}</p>
                  <UIButton
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
                  >
                    Remove
                  </UIButton>
                </div>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-zinc-700">Card title</span>
                  <input
                    type="text"
                    value={item}
                    placeholder={`Feature card ${index + 1}`}
                    onChange={(event) => handleUpdateItem(index, event.target.value)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
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
