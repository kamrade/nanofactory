import { describe, expect, it } from "vitest";

import { timelineDefaultDefinition } from "@/features/blocks/timeline/default/definition";

describe("timeline default definition", () => {
  it("normalizes missing items to the default timeline steps", () => {
    const normalized = timelineDefaultDefinition.normalizeProps({
      sectionTitle: "How it works",
      animate: true,
      items: [],
    });

    expect(normalized.sectionTitle).toBe("How it works");
    expect(Array.isArray(normalized.items)).toBe(true);
    expect(normalized.items).toHaveLength(3);
    expect(normalized.items[0]).toMatchObject({
      meta: "01",
      title: "Plan the flow",
    });
  });

  it("keeps draft timeline items even when the title is still empty", () => {
    const normalized = timelineDefaultDefinition.normalizeProps({
      sectionTitle: "Roadmap",
      animate: true,
      items: [
        {
          meta: "01",
          title: "",
          content: "",
        },
      ],
    });

    expect(normalized.items).toHaveLength(1);
    expect(normalized.items[0]).toMatchObject({
      meta: "01",
      title: "",
      content: "",
    });
  });
});
