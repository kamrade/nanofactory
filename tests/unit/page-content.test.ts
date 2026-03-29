import { describe, expect, it } from "vitest";

import { parsePageContentJson, validatePageContent } from "../../lib/editor/content";

describe("page content validation", () => {
  it("accepts supported block types and normalizes props", () => {
    const result = validatePageContent({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Hero title",
          },
        },
        {
          id: "features-1",
          type: "features",
          props: {
            sectionTitle: "Features",
            items: ["Fast", "Flexible"],
          },
        },
      ],
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.blocks[0]?.props).toMatchObject({
        title: "Hero title",
      });
      expect(result.data.blocks[0]?.props).toHaveProperty("subtitle");
      expect(result.data.blocks[0]?.props.imageAssetId).toBeUndefined();
      expect(result.data.blocks[1]?.props).toMatchObject({
        sectionTitle: "Features",
        items: ["Fast", "Flexible"],
      });
    }
  });

  it("accepts hero imageAssetId and keeps it in normalized props", () => {
    const result = validatePageContent({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Hero title",
            imageAssetId: "asset-123",
          },
        },
      ],
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.blocks[0]?.props).toMatchObject({
        imageAssetId: "asset-123",
      });
    }
  });

  it("rejects unsupported block types", () => {
    const result = validatePageContent({
      blocks: [
        {
          id: "unknown-1",
          type: "gallery",
          props: {},
        },
      ],
    });

    expect(result).toEqual({
      success: false,
      error: "Each block must include a valid id, type, and props object.",
    });
  });

  it("rejects invalid json payloads", () => {
    expect(parsePageContentJson("{")).toEqual({
      success: false,
      error: "Content payload must be valid JSON.",
    });
  });
});
