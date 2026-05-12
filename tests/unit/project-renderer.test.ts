import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectRenderer } from "../../src/components/projects/project-renderer";
import type { PageContent } from "../../db/schema";
import type { ProjectAssetRecord } from "../../src/lib/assets";
import type { BackgroundSceneRecord } from "../../src/lib/background-scenes/types";
import { DEFAULT_THEME_KEY } from "../../src/lib/themes";

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
          buttonAnchor: "",
          imageAssetId,
        },
      },
    ],
  };
}

function createCenteredHeroContent(imageAssetId?: string): PageContent {
  return {
    blocks: [
      {
        id: "hero-centered-1",
        type: "hero",
        variant: "centered",
        props: {
          title: "Centered Hero",
          subtitle: "A tighter centered hero variant",
          buttonText: "Launch",
          buttonAnchor: "",
          imageAssetId,
        },
      },
    ],
  };
}

function createHeroWithButtonAnchorContent(): PageContent {
  return {
    blocks: [
      {
        id: "hero-anchor-1",
        type: "hero",
        props: {
          title: "Hero with anchor",
          subtitle: "Scroll to target",
          buttonText: "Go pricing",
          buttonAnchor: "pricing",
        },
      },
      {
        id: "cta-target-1",
        type: "cta",
        anchorId: "pricing",
        props: {
          title: "Pricing target",
          buttonText: "Buy",
        },
      },
    ],
  };
}

function createFeaturesCardsContent(): PageContent {
  return {
    blocks: [
      {
        id: "features-cards-1",
        type: "features",
        variant: "cards",
        props: {
          sectionTitle: "Why this setup scales",
          items: ["Fewer moving parts", "Variant-aware rendering", "Clear growth path"],
        },
      },
    ],
  };
}

function createCtaContent(): PageContent {
  return {
    blocks: [
      {
        id: "cta-full-1",
        type: "cta",
        props: {
          title: "Go full width",
          buttonText: "Try now",
        },
      },
    ],
  };
}

function createBackgroundSceneContent(sceneId: string): PageContent {
  return {
    blocks: [
      {
        id: "cta-scene-1",
        type: "cta",
        backgroundSceneId: sceneId,
        props: {
          title: "Styled by scene",
          buttonText: "Inspect",
        },
      },
    ],
  };
}

function createGalleryNaturalContent(): PageContent {
  return {
    blocks: [
      {
        id: "gallery-1",
        type: "gallery",
        props: {
          sectionTitle: "Gallery",
          columns: 3,
          imageHeightMode: "natural",
          items: [
            { title: "Item A", description: "", price: "", meta: "" },
            { title: "Item B", description: "", price: "", meta: "" },
          ],
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
    kind: "image",
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

function createScene(id: string): BackgroundSceneRecord {
  const timestamp = new Date("2026-03-29T12:00:00.000Z");

  return {
    id,
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Stripes 45°",
    sceneJson: {
      version: 1,
      id: "bg_001",
      name: "Untitled Background",
      canvas: {
        backgroundColor: "#111111",
        width: 1200,
        height: 630,
      },
      layers: [
        {
          id: "layer_001",
          type: "stripes",
          name: "Stripes 45°",
          visible: true,
          opacity: 0.35,
          config: {
            stripeColor: "#ffffff",
            stripeWidth: 12,
            gapWidth: 12,
            angle: 45,
          },
        },
      ],
    },
    createdAt: timestamp,
    updatedAt: timestamp,
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

  it("renders a variant-aware hero block without breaking the page contract", () => {
    const asset = createAsset("asset-centered");
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Centered Hero Project",
        themeKey: "classic-light",
        content: createCenteredHeroContent(asset.id),
        assets: [asset],
      })
    );

    expect(html).toContain("Centered Hero");
    expect(html).toContain("A tighter centered hero variant");
    expect(html).toContain(asset.publicUrl);
  });

  it("renders a cards-based features variant", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Features Cards Project",
        themeKey: "classic-light",
        content: createFeaturesCardsContent(),
        assets: [],
      })
    );

    expect(html).toContain("Why this setup scales");
    expect(html).toContain("Fewer moving parts");
    expect(html).toContain("Variant-aware rendering");
    expect(html).toContain("Clear growth path");
  });

  it("applies the provided valid theme key to renderer root", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Themed Project",
        themeKey: "nightfall",
        content: createHeroContent(),
        assets: [],
      })
    );

    expect(html).toContain('data-theme="nightfall"');
  });

  it("falls back to default theme when theme key is invalid", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Fallback Theme Project",
        themeKey: "unknown-theme",
        content: createHeroContent(),
        assets: [],
      })
    );

    expect(html).toContain(`data-theme="${DEFAULT_THEME_KEY}"`);
  });

  it("renders with light mode by default on the root container", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Mode Default Project",
        themeKey: "sunwash",
        content: createHeroContent(),
        assets: [],
      })
    );

    expect(html).toContain('data-mode="light"');
  });

  it("does not render legacy project meta header block", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "No Meta Header Project",
        themeKey: "sunwash",
        content: createHeroContent(),
        assets: [],
      })
    );

    expect(html).not.toContain("Project:");
    expect(html).not.toContain("Published with Nanofactory");
  });

  it("renders cta blocks inside the standard section shell wrapper", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "CTA Project",
        themeKey: "sunwash",
        content: createCtaContent(),
        assets: [],
      })
    );

    expect(html).toContain("Go full width");
    expect(html).toContain('data-testid="SectionShell"');
  });

  it("renders a block background from background scene config using CSS gradients", () => {
    const scene = createScene("scene-1");
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Scene Project",
        themeKey: "sunwash",
        content: createBackgroundSceneContent(scene.id),
        assets: [],
        backgroundScenes: [scene],
      })
    );

    expect(html).toContain("repeating-linear-gradient(45deg");
    expect(html).toContain("rgba(107, 74, 34, 0.35)");
    expect(html).toContain("background-color:#f6ead9");
  });

  it("renders hero CTA as an anchor when buttonAnchor is set", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Hero Anchor Project",
        themeKey: "sunwash",
        content: createHeroWithButtonAnchorContent(),
        assets: [],
      })
    );

    expect(html).toContain('href="#pricing"');
    expect(html).toContain("Go pricing");
  });

  it("uses masonry-like column classes for gallery natural image height mode", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Gallery Natural Project",
        themeKey: "sunwash",
        content: createGalleryNaturalContent(),
        assets: [],
      })
    );

    expect(html).toContain("columns-1");
    expect(html).toContain("md:columns-3");
    expect(html).toContain("break-inside-avoid");
  });

  it("renders absolute gallery item links in platform mode", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Gallery Platform Links Project",
        slug: "project-n4",
        themeKey: "sunwash",
        content: createGalleryNaturalContent(),
        assets: [],
        galleryItemLinkMode: "absolute",
      })
    );

    expect(html).toContain('href="/p/project-n4/gallery-1/gallery-1-item-1?mode=light"');
  });

  it("renders relative gallery item links in custom-domain mode", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Gallery Domain Links Project",
        slug: "project-n4",
        themeKey: "sunwash",
        content: createGalleryNaturalContent(),
        assets: [],
        galleryItemLinkMode: "relative",
      })
    );

    expect(html).toContain('href="./gallery-1/gallery-1-item-1?mode=light"');
  });

  it("assigns an auto anchor id to blocks without explicit anchorId", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Auto Anchor Project",
        themeKey: "sunwash",
        content: createHeroContent(),
        assets: [],
      })
    );

    expect(html).toContain('id="hero-1"');
  });
});
