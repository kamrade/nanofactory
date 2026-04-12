import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIBadge } from "@/components/ui/badge";

describe("UIBadge", () => {
  it("renders with fully rounded corners for both sizes", () => {
    const sm = renderToStaticMarkup(createElement(UIBadge, { size: "sm" }, "Badge"));
    const lg = renderToStaticMarkup(createElement(UIBadge, { size: "lg" }, "Badge"));

    expect(sm).toContain("rounded-full");
    expect(sm).toContain("h-6");
    expect(lg).toContain("rounded-full");
    expect(lg).toContain("h-8");
  });

  it("applies variant/theme classes", () => {
    const outlinedPrimary = renderToStaticMarkup(
      createElement(UIBadge, { variant: "outlined", theme: "primary" }, "Primary")
    );
    const containedDanger = renderToStaticMarkup(
      createElement(UIBadge, { variant: "contained", theme: "danger" }, "Danger")
    );

    expect(outlinedPrimary).toContain("border-primary-line");
    expect(containedDanger).toContain("bg-danger-100");
    expect(containedDanger).toContain("text-text-danger");
  });
});
