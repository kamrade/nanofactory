import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BorderlessFormLayoutSection } from "@/app/showcase/uikit-sections/borderless-form-layout-section";

describe("BorderlessFormLayoutSection", () => {
  it("renders rows with focus-aware underlines instead of dividers", () => {
    const html = renderToStaticMarkup(createElement(BorderlessFormLayoutSection, { uiSize: "sm" }));

    expect(html).toContain("border-b");
    expect(html).toContain("focus-within:border-neutral-400");
    expect(html).toContain("max-w-none");
    expect(html).not.toContain('role="separator"');
  });
});
