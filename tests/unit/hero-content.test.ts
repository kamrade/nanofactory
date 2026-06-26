import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeroContent } from "@/features/blocks/hero/shared/hero-content";

function renderHeroContent(
  overrides: Partial<Parameters<typeof HeroContent>[0]> = {}
) {
  return renderToStaticMarkup(
    createElement(HeroContent, {
      eyebrow: "Eyebrow",
      title: "Hero title",
      subtitle: "Hero subtitle",
      buttonText: "Start now",
      buttonAnchor: "",
      animateMainText: false,
      headlineVariant: "default",
      contentStackClassName: "content-stack",
      eyebrowClassName: "eyebrow",
      headingGroupClassName: "heading-group",
      subtitleClassName: "subtitle",
      buttonClassName: "button",
      buttonRadiusVar: "--hero-radius-button",
      ...overrides,
    })
  );
}

describe("HeroContent", () => {
  it("renders eyebrow only when non-empty and wraps headline plus subtitle in the heading group", () => {
    const html = renderHeroContent();

    expect(html).toContain('class="content-stack"');
    expect(html).toContain('class="eyebrow"');
    expect(html).toContain("Eyebrow");
    expect(html).toContain('class="heading-group"');
    expect(html).toContain("Hero title");
    expect(html).toContain("Hero subtitle");
  });

  it("renders CTA as an anchor when buttonAnchor is present", () => {
    const html = renderHeroContent({ buttonAnchor: "pricing" });

    expect(html).toContain('href="#pricing"');
    expect(html).toContain("Start now");
  });

  it("renders CTA as a span and omits empty eyebrow when buttonAnchor is missing", () => {
    const html = renderHeroContent({ eyebrow: "   " });

    expect(html).toContain("<span");
    expect(html).not.toContain('href="#');
    expect(html).not.toContain("Eyebrow");
  });
});
