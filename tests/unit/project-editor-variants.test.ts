import { describe, expect, it } from "vitest";

import {
  applyVariantSwitchToContent,
  createPendingVariantSwitch,
  undoVariantSwitchInContent,
} from "@/components/editor/project-editor-variants";
import type { BlockVariantDefinition } from "@/features/blocks/shared/types";

function createDefinition(
  variant: "default" | "cards",
  fields: Array<{ key: string; label: string }>
): BlockVariantDefinition {
  return {
    type: "features",
    typeLabel: "Features",
    variant,
    label: variant === "default" ? "Default" : "Cards",
    fields: fields.map((field) => ({
      ...field,
      kind: "text" as const,
    })),
    createDefaultProps: () => ({}),
    normalizeProps: (input) => {
      const props = (input ?? {}) as Record<string, unknown>;
      const normalized: Record<string, unknown> = {};

      for (const field of fields) {
        normalized[field.key] = props[field.key];
      }

      return normalized;
    },
    Editor: (() => null) as BlockVariantDefinition["Editor"],
    Renderer: (() => null) as BlockVariantDefinition["Renderer"],
  };
}

describe("project editor variant helpers", () => {
  it("reports lost fields, applies the switch, and supports undo", () => {
    const defaultDefinition = createDefinition("default", [
      { key: "sectionTitle", label: "Section title" },
      { key: "extraNote", label: "Extra note" },
    ]);
    const cardsDefinition = createDefinition("cards", [
      { key: "sectionTitle", label: "Section title" },
    ]);
    const definitions = new Map([
      ["features:default", defaultDefinition],
      ["features:cards", cardsDefinition],
    ]);
    const getDefinition = (type: string, variant?: string) =>
      definitions.get(`${type}:${variant ?? "default"}`) ?? null;

    const block = {
      id: "features-1",
      type: "features" as const,
      variant: "default" as const,
      props: {
        sectionTitle: "Why this works",
        extraNote: "Only available in default variant",
      },
    };
    const content = {
      blocks: [block],
    };

    const pendingSwitch = createPendingVariantSwitch(
      block,
      defaultDefinition,
      "cards",
      getDefinition
    );

    expect(pendingSwitch).not.toBeNull();
    expect(pendingSwitch?.lostKeys).toEqual(["extraNote"]);
    expect(pendingSwitch?.lostLabels).toEqual(["Extra note"]);

    const switched = applyVariantSwitchToContent(
      content,
      block.id,
      pendingSwitch!.nextDefinition,
      getDefinition
    );

    expect(switched.content).toEqual({
      blocks: [
        {
          id: "features-1",
          type: "features",
          variant: "cards",
          props: {
            sectionTitle: "Why this works",
          },
        },
      ],
    });
    expect(switched.undo).toMatchObject({
      blockId: "features-1",
      fromLabel: "Default",
      toLabel: "Cards",
      typeLabel: "Features",
    });

    const restored = undoVariantSwitchInContent(switched.content, switched.undo!);

    expect(restored).toEqual(content);
  });
});
