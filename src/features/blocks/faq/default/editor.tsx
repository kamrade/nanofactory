"use client";

import type { BlockEditorProps } from "../../shared/types";
import { DebouncedTextArea, DebouncedTextInput } from "../../shared/editor/debounced-text-field";
import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIFormRow } from "@/components/ui/form-row";

type FaqItem = {
  question: string;
  answer: string;
};

function readStringField(props: Record<string, unknown>, key: string, fallback = "") {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

function readItems(props: Record<string, unknown>): FaqItem[] {
  if (!Array.isArray(props.items)) {
    return [];
  }

  return props.items
    .map((item) => {
      if (typeof item === "string") {
        const question = item.trim();
        if (!question) {
          return null;
        }

        return {
          question,
          answer: "",
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const question = typeof record.question === "string" ? record.question : "";
      if (!question) {
        return null;
      }

      return {
        question,
        answer: typeof record.answer === "string" ? record.answer : "",
      };
    })
    .filter((item): item is FaqItem => item !== null);
}

export function FAQDefaultEditor({ block, onChange }: BlockEditorProps) {
  const sectionTitle = readStringField(block.props, "sectionTitle");
  const subtitle = readStringField(block.props, "subtitle");
  const animate = block.props.animate !== false;
  const items = readItems(block.props);

  function update(nextProps: Partial<Record<"sectionTitle" | "subtitle" | "animate" | "items", unknown>>) {
    onChange({
      ...block.props,
      ...nextProps,
    });
  }

  function updateItem(index: number, nextItem: FaqItem) {
    update({
      items: items.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    });
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="faq-section-title" borderless>
            <DebouncedTextInput
              id="faq-section-title"
              size="sm"
              borderless
              value={sectionTitle}
              placeholder="Frequently asked questions"
              onCommit={(value) => update({ sectionTitle: value })}
            />
          </UIFormRow>

          <UIFormRow label="Subtitle" htmlFor="faq-subtitle" borderless>
            <DebouncedTextArea
              id="faq-subtitle"
              size="lg"
              borderless
              value={subtitle}
              rows={3}
              placeholder="Add a short note under the title."
              onCommit={(value) => update({ subtitle: value })}
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
          onClick={() =>
            update({
              items: [...items, { question: "", answer: "" }],
            })
          }
        >
          Add question
        </UIButton>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No questions yet. Add the first FAQ item.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={`${block.id}-faq-item-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-text-main">Question {index + 1}</p>
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

              <UIFormRow label="Question" htmlFor={`faq-question-${index}`} borderless>
                <DebouncedTextInput
                  id={`faq-question-${index}`}
                  size="sm"
                  borderless
                  value={item.question}
                  placeholder={`Question ${index + 1}`}
                  onCommit={(value) => updateItem(index, { ...item, question: value })}
                />
              </UIFormRow>

              <UIFormRow label="Answer" htmlFor={`faq-answer-${index}`} borderless>
                <DebouncedTextArea
                  id={`faq-answer-${index}`}
                  size="lg"
                  borderless
                  value={item.answer}
                  rows={4}
                  placeholder="Write the answer here."
                  onCommit={(value) => updateItem(index, { ...item, answer: value })}
                />
              </UIFormRow>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
