import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createPageBlock,
  getBlockDefinition,
  getBlockTypes,
} from "@/lib/editor/blocks";
import { TestimonialsDefaultRender } from "@/features/blocks/testimonials/default/render";

describe("testimonials block", () => {
  it("is registered in the block registry", () => {
    const definition = getBlockDefinition("testimonials");
    const blockTypes = getBlockTypes();

    expect(definition).not.toBeNull();
    expect(definition?.label).toBe("Default");
    expect(blockTypes.some((type) => type.type === "testimonials")).toBe(true);
    expect(blockTypes.find((type) => type.type === "testimonials")?.label).toBe("Testimonials");
  });

  it("creates a default testimonials block", () => {
    const block = createPageBlock("testimonials");

    expect(block.type).toBe("testimonials");
    expect(block.variant).toBe("default");
    expect(block.props).toMatchObject({
      sectionTitle: "What people say",
      subtitle: "A simple, readable way to show a few short endorsements.",
      animate: true,
    });
    expect(Array.isArray(block.props.items)).toBe(true);
    expect((block.props.items as Array<unknown>)).toHaveLength(3);
  });

  it("preserves imageAssetId in normalized testimonial items", () => {
    const definition = getBlockDefinition("testimonials");

    const normalized = definition?.normalizeProps({
      sectionTitle: "Custom title",
      subtitle: "Custom subtitle",
      items: [
        {
          quote: "Great product.",
          name: "Taylor",
          role: "Operator",
          imageAssetId: "asset-123",
        },
      ],
    });

    expect(normalized?.items).toEqual([
      {
        quote: "Great product.",
        name: "Taylor",
        role: "Operator",
        imageAssetId: "asset-123",
      },
    ]);
  });

  it("does not render a portrait image when the asset is missing", () => {
    const html = renderToStaticMarkup(
      createElement(TestimonialsDefaultRender, {
        block: {
          id: "block-testimonials",
          type: "testimonials",
          variant: "default",
          props: {
            sectionTitle: "What people say",
            subtitle: "",
            animate: false,
            items: [
              {
                quote: "Simple and reliable.",
                name: "Alex",
                role: "Founder",
                imageAssetId: "missing-asset",
              },
            ],
          },
        },
        assetMap: new Map(),
        theme: {
          muted: "muted",
          buttonTone: "buttonTone",
          button: "button",
          kicker: "kicker",
        },
        projectSpacingScale: "md",
        projectSurfaceStyle: "default",
      })
    );

    expect(html).toContain("Simple and reliable.");
    expect(html).toContain("Alex");
    expect(html).not.toContain("<img");
  });

  it("renders a square portrait image when the asset exists", () => {
    const html = renderToStaticMarkup(
      createElement(TestimonialsDefaultRender, {
        block: {
          id: "block-testimonials",
          type: "testimonials",
          variant: "default",
          props: {
            sectionTitle: "What people say",
            subtitle: "",
            animate: false,
            items: [
              {
                quote: "Simple and reliable.",
                name: "Alex",
                role: "Founder",
                imageAssetId: "asset-1",
              },
            ],
          },
        },
        assetMap: new Map([
          [
            "asset-1",
            {
              id: "asset-1",
              projectId: "project-1",
              kind: "image",
              storageKey: "projects/project-1/assets/asset-1.webp",
              originalFilename: "avatar.webp",
              mimeType: "image/webp",
              sizeBytes: 1024,
              width: 512,
              height: 512,
              alt: "Alex portrait",
              createdAt: new Date("2026-03-29T12:00:00.000Z"),
              updatedAt: new Date("2026-03-29T12:00:00.000Z"),
              publicUrl: "https://assets.example.test/projects/project-1/assets/asset-1.webp",
            },
          ],
        ]),
        theme: {
          muted: "muted",
          buttonTone: "buttonTone",
          button: "button",
          kicker: "kicker",
        },
        projectSpacingScale: "md",
        projectSurfaceStyle: "default",
      })
    );

    expect(html).toContain("Alex portrait");
    expect(html).toContain('<img');
  });
});
