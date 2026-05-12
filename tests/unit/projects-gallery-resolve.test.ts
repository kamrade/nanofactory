import { describe, expect, it } from "vitest";

import type { PageContent } from "@/db/schema";
import { resolveProjectsGalleryEntryFromContent } from "@/lib/projects-gallery/resolve";

function createProjectsGalleryContent(): PageContent {
  return {
    blocks: [
      {
        id: "projects-gallery-1",
        type: "projects-gallery",
        anchorId: "projects",
        props: {
          sectionTitle: "Projects",
          galleryAnchor: "projects",
          items: [
            {
              projectAnchor: "project-1",
              galleryAnchor: "gallery-1",
              title: "Project 1",
              description: "",
              descriptionMd: "",
              price: "",
              meta: "",
              imageAssetId: undefined,
              galleryItems: [
                {
                  kind: "image",
                  entryAnchor: "project-1-gallery-1-item-1",
                  title: "Image 1",
                  description: "",
                  contentMd: "",
                  price: "",
                  meta: "",
                  assetId: undefined,
                },
                {
                  kind: "markdown",
                  entryAnchor: "project-1-gallery-1-item-2",
                  title: "Markdown 2",
                  description: "",
                  contentMd: "## md",
                  price: "",
                  meta: "",
                  assetId: undefined,
                },
                {
                  kind: "image",
                  entryAnchor: "project-1-gallery-1-item-3",
                  title: "Image 3",
                  description: "",
                  contentMd: "",
                  price: "",
                  meta: "",
                  assetId: undefined,
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

describe("resolveProjectsGalleryEntryFromContent image-only navigation", () => {
  it("skips markdown entries for previous/next navigation when current entry is image", () => {
    const firstImage = resolveProjectsGalleryEntryFromContent(
      createProjectsGalleryContent(),
      "project-1",
      "gallery-1",
      "project-1-gallery-1-item-1"
    );
    expect(firstImage).not.toBeNull();
    expect(firstImage?.previousEntryAnchor).toBeUndefined();
    expect(firstImage?.nextEntryAnchor).toBe("project-1-gallery-1-item-3");

    const thirdEntryImage = resolveProjectsGalleryEntryFromContent(
      createProjectsGalleryContent(),
      "project-1",
      "gallery-1",
      "project-1-gallery-1-item-3"
    );
    expect(thirdEntryImage).not.toBeNull();
    expect(thirdEntryImage?.previousEntryAnchor).toBe("project-1-gallery-1-item-1");
    expect(thirdEntryImage?.nextEntryAnchor).toBeUndefined();
  });

  it("resolves previous/next to nearest images when current entry is markdown", () => {
    const markdownEntry = resolveProjectsGalleryEntryFromContent(
      createProjectsGalleryContent(),
      "project-1",
      "gallery-1",
      "project-1-gallery-1-item-2"
    );
    expect(markdownEntry).not.toBeNull();
    expect(markdownEntry?.kind).toBe("markdown");
    expect(markdownEntry?.previousEntryAnchor).toBe("project-1-gallery-1-item-1");
    expect(markdownEntry?.nextEntryAnchor).toBe("project-1-gallery-1-item-3");
  });
});
