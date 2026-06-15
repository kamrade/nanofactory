import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("defaults to surface background", () => {
    const html = renderToStaticMarkup(createElement(Card, null, "Content"));

    expect(html).toContain("bg-surface");
    expect(html).not.toContain("bg-surface-alt");
  });

  it("supports alt background", () => {
    const html = renderToStaticMarkup(createElement(Card, { tone: "alt" }, "Content"));

    expect(html).toContain("bg-surface-alt");
  });
});
