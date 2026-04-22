import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectRenderer } from "../../components/projects/project-renderer";
import type { PageContent } from "../../db/schema";
import type { ProjectAssetRecord } from "../../lib/assets";
import type { BackgroundSceneRecord } from "../../lib/background-scenes/types";
import { DEFAULT_THEME_KEY } from "../../lib/themes";

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
          imageAssetId,
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

function createFullBleedCtaContent(): PageContent {
  return {
    blocks: [
      {
        id: "cta-full-1",
        type: "cta",
        fullBleed: true,
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

  it("can hide project meta block when showProjectMeta is false", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Meta Hidden Project",
        themeKey: "sunwash",
        content: createHeroContent(),
        assets: [],
        showPublishedBadge: false,
        showProjectMeta: false,
      })
    );

    expect(html).not.toContain("Project:");
    expect(html).not.toContain("Mode:");
    expect(html).not.toContain("Light");
    expect(html).not.toContain("Dark");
  });

  it("renders full-bleed blocks without the container wrapper card", () => {
    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: "Full Bleed Project",
        themeKey: "sunwash",
        content: createFullBleedCtaContent(),
        assets: [],
        showPublishedBadge: false,
        showProjectMeta: false,
      })
    );

    expect(html).toContain("Go full width");
    expect(html).toContain('class="w-full px-4 sm:px-6"');
    expect(html).not.toContain("rounded-[2rem]");
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
        showPublishedBadge: false,
        showProjectMeta: false,
      })
    );

    expect(html).toContain("repeating-linear-gradient(45deg");
    expect(html).toContain("rgba(255, 255, 255, 0.35)");
    expect(html).toContain("background-color:#111111");
  });
});
