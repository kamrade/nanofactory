import { describe, expect, it } from "vitest";

import { normalizePageContent } from "@/lib/editor/content";

describe("pricing content normalization", () => {
  it("keeps pricing blocks in normalized content", () => {
    const content = normalizePageContent({
      blocks: [
        {
          id: "block-pricing",
          type: "pricing",
          variant: "default",
          props: {
            sectionTitle: "Pricing",
            subtitle: "Pick a plan.",
            featuredIndex: 1,
            plans: [
              {
                title: "Starter",
                price: "$19",
                description: "For small launches.",
                buttonText: "Choose Starter",
                buttonHref: "/start",
                includes: ["One"],
              },
            ],
          },
        },
      ],
    });

    expect(content.blocks).toHaveLength(1);
    expect(content.blocks[0].type).toBe("pricing");
    expect(content.blocks[0].props).toMatchObject({
      sectionTitle: "Pricing",
      featuredIndex: 0,
    });
  });
});
