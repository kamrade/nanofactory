"use client";

import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIFormRow } from "@/components/ui/form-row";
import type { BlockEditorProps } from "../../shared/types";
import { DebouncedTextArea as UITextArea, DebouncedTextInput as UITextInput } from "../../shared/editor/debounced-text-field";
import {
  addTimelineItem,
  removeTimelineItem,
  type TimelineItem,
  updateTimelineItem,
} from "./editor-operations";

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readItems(props: Record<string, unknown>): TimelineItem[] {
  if (!Array.isArray(props.items)) {
    return [];
  }

  return props.items
    .map((item) => {
      if (typeof item === "string") {
        const title = item.trim();
        if (!title) {
          return null;
        }

        return {
          meta: "",
          date: "",
          status: "",
          title,
          content: "",
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        meta: typeof record.meta === "string" ? record.meta : "",
        date: typeof record.date === "string" ? record.date : "",
        status: typeof record.status === "string" ? record.status : "",
        title: typeof record.title === "string" ? record.title : "",
        content: typeof record.content === "string" ? record.content : "",
      };
    })
    .filter((item): item is TimelineItem => item !== null);
}

export function TimelineDefaultEditor({ block, onChange }: BlockEditorProps) {
  const sectionTitle = readSectionTitle(block.props);
  const animate = block.props.animate !== false;
  const items = readItems(block.props);

  function update(nextValue: Partial<Record<"sectionTitle" | "animate" | "items", unknown>>) {
    onChange({
      ...block.props,
      ...nextValue,
    });
  }

  function updateItem(index: number, nextItem: TimelineItem) {
    update({
      items: updateTimelineItem(items, index, nextItem),
    });
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="timeline-section-title" borderless>
            <UITextInput
              id="timeline-section-title"
              size="sm"
              borderless
              value={sectionTitle}
              placeholder="How it works"
              onValueChange={(value) => update({ sectionTitle: value })}
            />
          </UIFormRow>

          <UIFormRow label="Animate title" borderless>
            <UICheckbox
              checked={animate}
              onChange={(event) => update({ animate: event.currentTarget.checked })}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="flex justify-start">
        <UIButton
          type="button"
          size="sm"
          theme="primary"
          variant="contained"
          onClick={() => update({ items: addTimelineItem(items) })}
        >
          Add step
        </UIButton>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No steps yet. Add the first timeline item.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={`${block.id}-timeline-item-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-text-main">Step {index + 1}</p>
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() => update({ items: removeTimelineItem(items, index) })}
                >
                  Remove
                </UIButton>
              </div>

              <UIFormRow label="Meta" htmlFor={`timeline-item-meta-${index}`} borderless>
                <UITextInput
                  id={`timeline-item-meta-${index}`}
                  size="sm"
                  borderless
                  value={item.meta}
                  placeholder="01"
                  onValueChange={(value) => updateItem(index, { ...item, meta: value })}
                />
              </UIFormRow>

              <UIFormRow label="Date" htmlFor={`timeline-item-date-${index}`} borderless>
                <UITextInput
                  id={`timeline-item-date-${index}`}
                  size="sm"
                  borderless
                  value={item.date}
                  placeholder="Q1 2026"
                  onValueChange={(value) => updateItem(index, { ...item, date: value })}
                />
              </UIFormRow>

              <UIFormRow label="Status" htmlFor={`timeline-item-status-${index}`} borderless>
                <UITextInput
                  id={`timeline-item-status-${index}`}
                  size="sm"
                  borderless
                  value={item.status}
                  placeholder="Planned"
                  onValueChange={(value) => updateItem(index, { ...item, status: value })}
                />
              </UIFormRow>

              <UIFormRow label="Title" htmlFor={`timeline-item-title-${index}`} borderless>
                <UITextInput
                  id={`timeline-item-title-${index}`}
                  size="sm"
                  borderless
                  value={item.title}
                  placeholder={`Step ${index + 1}`}
                  onValueChange={(value) => updateItem(index, { ...item, title: value })}
                />
              </UIFormRow>

              <UIFormRow label="Description" htmlFor={`timeline-item-content-${index}`} borderless>
                <UITextArea
                  id={`timeline-item-content-${index}`}
                  size="lg"
                  borderless
                  value={item.content}
                  rows={3}
                  placeholder="Describe what happens in this step."
                  onChange={(event) => updateItem(index, { ...item, content: event.target.value })}
                />
              </UIFormRow>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
