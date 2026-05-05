import { describe, expect, it } from "vitest";

import { buildGalleryItemNavigationHrefs } from "@/lib/gallery-item/navigation";

describe("buildGalleryItemNavigationHrefs", () => {
  it("builds relative back/previous/next hrefs when all anchors exist", () => {
    const hrefs = buildGalleryItemNavigationHrefs({
      galleryAnchor: "gallery-1",
      previousItemAnchor: "gallery-1-item-1",
      nextItemAnchor: "gallery-1-item-3",
    });

    expect(hrefs.backHref).toBe("../..#gallery-1");
    expect(hrefs.previousHref).toBe("./gallery-1-item-1");
    expect(hrefs.nextHref).toBe("./gallery-1-item-3");
  });

  it("omits previous/next hrefs at edges", () => {
    const hrefs = buildGalleryItemNavigationHrefs({
      galleryAnchor: "gallery-1",
    });

    expect(hrefs.backHref).toBe("../..#gallery-1");
    expect(hrefs.previousHref).toBeUndefined();
    expect(hrefs.nextHref).toBeUndefined();
  });

  it("preserves dark mode in generated hrefs", () => {
    const hrefs = buildGalleryItemNavigationHrefs({
      galleryAnchor: "gallery-1",
      previousItemAnchor: "gallery-1-item-1",
      nextItemAnchor: "gallery-1-item-3",
      mode: "dark",
    });

    expect(hrefs.backHref).toBe("../..?mode=dark#gallery-1");
    expect(hrefs.previousHref).toBe("./gallery-1-item-1?mode=dark");
    expect(hrefs.nextHref).toBe("./gallery-1-item-3?mode=dark");
  });
});
