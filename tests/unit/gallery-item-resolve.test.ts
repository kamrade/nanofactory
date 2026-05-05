import { describe, expect, it } from "vitest";

import { resolveGalleryItemFromContent } from "@/lib/gallery-item/resolve";
import type { PageContent } from "@/db/schema";

function createContent(): PageContent {
  return {
    blocks: [
      {
        id: "gallery-block-1",
        type: "gallery",
        anchorId: "gallery-main",
        props: {
          sectionTitle: "Gallery",
          columns: 3,
          imageHeightMode: "fixed",
          items: [
            { title: "Item A", imageAnchor: "item-a", description: "", price: "", meta: "" },
            { title: "Item B", imageAnchor: "item-b", description: "", price: "", meta: "" },
            { title: "Item C", imageAnchor: "item-c", description: "", price: "", meta: "" },
          ],
        },
      },
    ],
  };
}

describe("resolveGalleryItemFromContent", () => {
  it("resolves a middle item and computes previous/next anchors", () => {
    const resolved = resolveGalleryItemFromContent(createContent(), "gallery-main", "item-b");

    expect(resolved).not.toBeNull();
    expect(resolved?.itemIndex).toBe(1);
    expect(resolved?.totalItems).toBe(3);
    expect(resolved?.previousItemAnchor).toBe("item-a");
    expect(resolved?.nextItemAnchor).toBe("item-c");
  });

  it("returns null when gallery anchor is invalid", () => {
    const resolved = resolveGalleryItemFromContent(createContent(), "missing-gallery", "item-a");
    expect(resolved).toBeNull();
  });

  it("returns null when item anchor is invalid", () => {
    const resolved = resolveGalleryItemFromContent(createContent(), "gallery-main", "missing-item");
    expect(resolved).toBeNull();
  });
});

