import { describe, expect, it } from "vitest";

import {
  buildProjectsGalleryEntryHref,
  buildProjectsGalleryEntryNavHrefs,
} from "@/lib/projects-gallery/navigation";

describe("buildProjectsGalleryEntryHref", () => {
  it("builds relative nested entry href with gallery segment", () => {
    const href = buildProjectsGalleryEntryHref({
      linkMode: "relative",
      projectSlug: "project-n4",
      projectAnchor: "project-1",
      galleryAnchor: "gallery-1",
      entryAnchor: "project-1-gallery-1-item-1",
      mode: "light",
    });

    expect(href).toBe("./gallery-1/project-1-gallery-1-item-1?mode=light");
  });

  it("builds absolute nested entry href", () => {
    const href = buildProjectsGalleryEntryHref({
      linkMode: "absolute",
      projectSlug: "project-n4",
      projectAnchor: "project-1",
      galleryAnchor: "gallery-1",
      entryAnchor: "project-1-gallery-1-item-1",
      mode: "dark",
    });

    expect(href).toBe("/p/project-n4/project-1/gallery-1/project-1-gallery-1-item-1?mode=dark");
  });
});

describe("buildProjectsGalleryEntryNavHrefs", () => {
  it("builds relative back/previous/next hrefs for entry page", () => {
    const hrefs = buildProjectsGalleryEntryNavHrefs({
      linkMode: "relative",
      projectSlug: "project-n4",
      projectAnchor: "project-1",
      galleryAnchor: "gallery-1",
      previousEntryAnchor: "project-1-gallery-1-item-1",
      nextEntryAnchor: "project-1-gallery-1-item-3",
      mode: "light",
    });

    expect(hrefs.backHref).toBe("..?mode=light");
    expect(hrefs.previousHref).toBe("./project-1-gallery-1-item-1?mode=light");
    expect(hrefs.nextHref).toBe("./project-1-gallery-1-item-3?mode=light");
  });

  it("builds absolute back/previous/next hrefs for entry page", () => {
    const hrefs = buildProjectsGalleryEntryNavHrefs({
      linkMode: "absolute",
      projectSlug: "project-n4",
      projectAnchor: "project-1",
      galleryAnchor: "gallery-1",
      previousEntryAnchor: "project-1-gallery-1-item-1",
      nextEntryAnchor: "project-1-gallery-1-item-3",
      mode: "dark",
    });

    expect(hrefs.backHref).toBe("/p/project-n4/project-1/gallery-1?mode=dark");
    expect(hrefs.previousHref).toBe(
      "/p/project-n4/project-1/gallery-1/project-1-gallery-1-item-1?mode=dark"
    );
    expect(hrefs.nextHref).toBe(
      "/p/project-n4/project-1/gallery-1/project-1-gallery-1-item-3?mode=dark"
    );
  });
});
