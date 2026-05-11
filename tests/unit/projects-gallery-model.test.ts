import { describe, expect, it } from "vitest";

import { readProjectsGalleryProps } from "@/features/blocks/projects-gallery/default/model";

describe("readProjectsGalleryProps", () => {
  it("maps legacy project description into descriptionMd when descriptionMd is missing", () => {
    const props = readProjectsGalleryProps({
      sectionTitle: "Projects",
      galleryAnchor: "projects",
      items: [
        {
          projectAnchor: "project-1",
          galleryAnchor: "gallery-1",
          title: "Legacy project",
          description: "Legacy plain description",
          price: "",
          meta: "",
          imageAssetId: undefined,
          galleryItems: [],
        },
      ],
    });

    expect(props.items).toHaveLength(1);
    expect(props.items[0]?.description).toBe("Legacy plain description");
    expect(props.items[0]?.descriptionMd).toBe("Legacy plain description");
  });

  it("keeps explicit descriptionMd when provided in new payload", () => {
    const props = readProjectsGalleryProps({
      sectionTitle: "Projects",
      galleryAnchor: "projects",
      items: [
        {
          projectAnchor: "project-1",
          galleryAnchor: "gallery-1",
          title: "Modern project",
          description: "Card plain description",
          descriptionMd: "## Markdown description",
          price: "",
          meta: "",
          imageAssetId: undefined,
          galleryItems: [],
        },
      ],
    });

    expect(props.items).toHaveLength(1);
    expect(props.items[0]?.description).toBe("Card plain description");
    expect(props.items[0]?.descriptionMd).toBe("## Markdown description");
  });
});
