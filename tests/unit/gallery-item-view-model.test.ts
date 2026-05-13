import { describe, expect, it } from "vitest";

import { buildGalleryItemNavigationHrefs } from "@/lib/gallery-item/navigation";
import { buildGalleryItemPageViewModel } from "@/lib/gallery-item/view-model";

const resolvedItem = {
  galleryAnchor: "gallery-1",
  itemAnchor: "entry-2",
  itemIndex: 1,
  totalItems: 3,
  previousItemAnchor: "entry-1",
  nextItemAnchor: "entry-3",
  title: "Entry 2",
  description: "Description",
  price: "$100",
  meta: "Meta",
  projectSlug: "demo-project",
  projectName: "Demo Project",
};

describe("buildGalleryItemNavigationHrefs", () => {
  it("uses provided backHref override", () => {
    const hrefs = buildGalleryItemNavigationHrefs({
      galleryAnchor: "gallery-1",
      previousItemAnchor: "entry-1",
      nextItemAnchor: "entry-3",
      mode: "dark",
      backHref: "/p/demo-project?mode=dark#gallery-1",
    });

    expect(hrefs.backHref).toBe("/p/demo-project?mode=dark#gallery-1");
    expect(hrefs.previousHref).toBe("./entry-1?mode=dark");
    expect(hrefs.nextHref).toBe("./entry-3?mode=dark");
  });
});

describe("buildGalleryItemPageViewModel", () => {
  it("builds absolute back href for platform hosts", () => {
    const viewModel = buildGalleryItemPageViewModel({
      resolvedItem,
      projectThemeKey: "not-a-theme",
      mode: "dark",
      host: "app.olala.beauty",
    });

    expect(viewModel.resolvedThemeKey).toBe("sunwash");
    expect(viewModel.navigationHrefs.backHref).toBe("/p/demo-project?mode=dark#gallery-1");
    expect(viewModel.navigationHrefs.previousHref).toBe("./entry-1?mode=dark");
    expect(viewModel.navigationHrefs.nextHref).toBe("./entry-3?mode=dark");
  });

  it("keeps relative back href for custom hosts", () => {
    const viewModel = buildGalleryItemPageViewModel({
      resolvedItem,
      projectThemeKey: "nightfall",
      mode: "light",
      host: "portfolio.example.com",
    });

    expect(viewModel.resolvedThemeKey).toBe("nightfall");
    expect(viewModel.navigationHrefs.backHref).toBe("..?mode=light#gallery-1");
    expect(viewModel.navigationHrefs.previousHref).toBe("./entry-1?mode=light");
    expect(viewModel.navigationHrefs.nextHref).toBe("./entry-3?mode=light");
  });
});
