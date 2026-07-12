import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UICheckbox } from "@/components/ui/checkbox";
import { UISwitcher } from "@/components/ui/switcher";

describe("UI form controls", () => {
  it("renders checkbox sizes", () => {
    const smallHtml = renderToStaticMarkup(createElement(UICheckbox, { size: "sm", label: "Label" }));
    const mediumHtml = renderToStaticMarkup(createElement(UICheckbox, { size: "md", label: "Label" }));
    const largeHtml = renderToStaticMarkup(createElement(UICheckbox, { size: "lg", label: "Label" }));

    expect(smallHtml).toContain("h-4 w-4");
    expect(mediumHtml).toContain("h-5 w-5");
    expect(largeHtml).toContain("h-6 w-6");
    expect(smallHtml).toContain("text-sm leading-5");
    expect(mediumHtml).toContain("text-sm leading-5");
    expect(largeHtml).toContain("text-base leading-6");
  });

  it("renders checkbox border radius values", () => {
    const noneHtml = renderToStaticMarkup(createElement(UICheckbox, { borderRadius: "none" }));
    const mdHtml = renderToStaticMarkup(createElement(UICheckbox, { borderRadius: "md" }));
    const lgHtml = renderToStaticMarkup(createElement(UICheckbox, { borderRadius: "lg" }));

    expect(noneHtml).toContain("rounded-none");
    expect(mdHtml).toContain("rounded-[4px]");
    expect(lgHtml).toContain("rounded-[6px]");
  });

  it("renders switcher sizes", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UISwitcher, { size: "sm", checked: false, label: "Label" })
    );
    const mediumHtml = renderToStaticMarkup(
      createElement(UISwitcher, { size: "md", checked: false, label: "Label" })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UISwitcher, { size: "lg", checked: false, label: "Label" })
    );

    expect(smallHtml).toContain('data-size="sm"');
    expect(mediumHtml).toContain('data-size="md"');
    expect(largeHtml).toContain('data-size="lg"');
  });
});
