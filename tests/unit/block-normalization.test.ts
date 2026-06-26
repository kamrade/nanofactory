import { describe, expect, it } from "vitest";

import { readAppHeaderProps } from "@/features/blocks/app-header/default/model";
import { heroDefaultDefinition } from "@/features/blocks/hero/default/definition";
import { heroCenteredDefinition } from "@/features/blocks/hero/centered/definition";
import { galleryDefaultDefinition } from "@/features/blocks/gallery/default/definition";

describe("block normalization", () => {
  it("normalizes app header anchors and filters invalid menu items", () => {
    const props = readAppHeaderProps({
      menuItems: [
        { label: "First", anchorId: "Section-HERO" },
        { label: "Invalid", anchorId: "1-invalid" },
        { label: "", anchorId: "features" },
      ],
    });

    expect(props.menuItems).toEqual([{ label: "First", anchorId: "section-hero" }]);
  });

  it("keeps hero default buttonAnchor with fallback", () => {
    const normalized = heroDefaultDefinition.normalizeProps({
      title: "Hero title",
      buttonAnchor: "pricing",
    });

    expect(normalized).toMatchObject({
      title: "Hero title",
      buttonAnchor: "pricing",
    });

    const fallback = heroDefaultDefinition.normalizeProps({});
    expect(fallback).toMatchObject({ buttonAnchor: "" });
  });

  it("keeps hero centered buttonAnchor with fallback", () => {
    const normalized = heroCenteredDefinition.normalizeProps({
      title: "Centered",
      buttonAnchor: "contact",
    });

    expect(normalized).toMatchObject({
      title: "Centered",
      buttonAnchor: "contact",
    });

    const fallback = heroCenteredDefinition.normalizeProps({});
    expect(fallback).toMatchObject({ buttonAnchor: "" });
  });

  it("normalizes hero animation and contentPosition fields and ignores legacy animateContent", () => {
    const normalized = heroDefaultDefinition.normalizeProps({
      title: "Hero",
      animateMainText: true,
      animateContent: true,
      contentPosition: "top",
    });

    expect(normalized).toMatchObject({
      title: "Hero",
      animateMainText: true,
      contentPosition: "top",
    });
    expect(normalized).not.toHaveProperty("animateContent");

    const fallback = heroCenteredDefinition.normalizeProps({
      contentPosition: "invalid",
      animateMainText: "yes",
    });

    expect(fallback).toMatchObject({
      contentPosition: "centered",
      animateMainText: false,
    });
  });

  it("normalizes gallery imageHeightMode with fixed fallback", () => {
    const natural = galleryDefaultDefinition.normalizeProps({
      sectionTitle: "Gallery",
      imageHeightMode: "natural",
      items: [{ title: "One" }],
    });
    expect(natural).toMatchObject({ imageHeightMode: "natural" });

    const fallback = galleryDefaultDefinition.normalizeProps({
      sectionTitle: "Gallery",
      imageHeightMode: "invalid",
      items: [{ title: "One" }],
    });
    expect(fallback).toMatchObject({ imageHeightMode: "fixed" });
  });
});
