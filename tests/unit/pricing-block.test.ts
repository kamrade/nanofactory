import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PricingDefaultRender } from "@/features/blocks/pricing/default/render";
import { createPageBlock, getBlockDefinition } from "@/lib/editor/blocks";

describe("pricing block", () => {
  it("is registered and creates a default pricing block", () => {
    const definition = getBlockDefinition("pricing");
    const block = createPageBlock("pricing");

    expect(definition).not.toBeNull();
    expect(definition?.label).toBe("Default");
    expect(block.type).toBe("pricing");
    expect(block.variant).toBe("default");
    expect(block.props).toMatchObject({
      sectionTitle: "Pricing",
      subtitle: "Pick a plan that matches where you are today and keeps the next step obvious.",
      featuredIndex: 1,
    });
    expect(Array.isArray(block.props.plans)).toBe(true);
    expect((block.props.plans as Array<unknown>)).toHaveLength(3);
  });

  it("renders the featured card and includes list", () => {
    const html = renderToStaticMarkup(
      createElement(PricingDefaultRender, {
        block: {
          id: "block-pricing",
          type: "pricing",
          variant: "default",
          props: {
            sectionTitle: "Pricing",
            subtitle: "Pick the best fit.",
            featuredIndex: 0,
            plans: [
              {
                title: "Starter",
                price: "$19",
                description: "For small launches.",
                buttonText: "Choose Starter",
                buttonHref: "/start",
                includes: ["One", "Two"],
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

    expect(html).toContain('data-featured="true"');
    expect(html).toContain("Includes");
    expect(html).toContain("Choose Starter");
    expect(html).toContain("One");
    expect(html).toContain("Two");
  });
});
