import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UICheckbox } from "@/components/ui/checkbox";
import { UISwitcher } from "@/components/ui/switcher";

describe("UI form controls", () => {
  it("renders checkbox sizes", () => {
    const smallHtml = renderToStaticMarkup(createElement(UICheckbox, { size: "sm" }));
    const largeHtml = renderToStaticMarkup(createElement(UICheckbox, { size: "lg" }));

    expect(smallHtml).toContain("h-4 w-4");
    expect(largeHtml).toContain("h-5 w-5");
  });

  it("renders switcher sizes", () => {
    const smallHtml = renderToStaticMarkup(createElement(UISwitcher, { size: "sm", checked: false }));
    const largeHtml = renderToStaticMarkup(createElement(UISwitcher, { size: "lg", checked: false }));

    expect(smallHtml).toContain("h-[18px] w-[30px]");
    expect(largeHtml).toContain("h-[22px] w-[34px]");
  });
});
