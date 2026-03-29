import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectRenderer } from "../../components/projects/project-renderer";
import type { PageContent } from "../../db/schema";
import type { ProjectAssetRecord } from "../../lib/assets";

function createHeroContent(imageAssetId?: string): PageContent {
  return {
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        props: {
          title: "Hello from Nanofactory",
          subtitle: "Public hero subtitle",
          buttonText: "Start",
          imageAssetId,
        },
      },
    ],
  };
}

function createAsset(id: string): ProjectAssetRecord {
  const timestamp = new Date("2026-03-29T12:00:00.000Z");

  return {
    id,
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    storageKey: `projects/550e8400-e29b-41d4-a716-446655440000/assets/${id}.webp`,
    originalFilename: `${id}.webp`,
    mimeType: "image/webp",
    sizeBytes: 1024,
    width: null,
    height: null,
    alt: "Hero image",
    createdAt: timestamp,
    updatedAt: timestamp,
    publicUrl: `https://assets.olala.beauty/projects/550e8400-e29b-41d4-a716-446655440000/assets/${id}.webp`,
  };
}

describe("ProjectRenderer", () => {
  it("renders a hero image when the asset id resolves inside the current project asset set", () => {
    const asset = createAsset("asset-1");
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Hero Project",
        themeKey: "classic-light",
        content: createHeroContent(asset.id),
        assets: [asset],
      })
    );

    expect(html).toContain(asset.publicUrl);
    expect(html).toContain('alt="Hero image"');
    expect(html).toContain("Hello from Nanofactory");
  });

  it("skips the image gracefully when the hero asset id does not resolve", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Hero Project",
        themeKey: "classic-light",
        content: createHeroContent("missing-asset"),
        assets: [],
      })
    );

    expect(html).not.toContain("assets.olala.beauty");
    expect(html).toContain("Hello from Nanofactory");
    expect(html).toContain("Public hero subtitle");
  });
});
