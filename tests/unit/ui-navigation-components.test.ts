import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UITabs } from "@/components/ui/tabs";

describe("UI navigation components", () => {
  it("renders tabs as links and marks active item with aria-current", () => {
    const html = renderToStaticMarkup(
      createElement(UITabs, {
        ariaLabel: "Showcase tabs",
        items: [
          { label: "UIKit", href: "/showcase/uikit", active: true },
          { label: "Sections", href: "/showcase/sections", active: false },
        ],
      })
    );

    expect(html).toContain('href="/showcase/uikit"');
    expect(html).toContain('href="/showcase/sections"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("UIKit");
    expect(html).toContain("Sections");
  });

  it("renders segmented control with radiogroup semantics and options", () => {
    const html = renderToStaticMarkup(
      createElement(UISegmentedControl, {
        ariaLabel: "Mode",
        value: "light",
        onValueChange: () => undefined,
        options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
      })
    );

    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('role="radio"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain("Light");
    expect(html).toContain("Dark");
  });
});
