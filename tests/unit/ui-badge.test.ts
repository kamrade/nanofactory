import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIBadge } from "@/components/ui/badge";

describe("UIBadge", () => {
  it("renders sizes and border radius variants", () => {
    const sm = renderToStaticMarkup(createElement(UIBadge, { size: "sm" }, "Badge"));
    const md = renderToStaticMarkup(createElement(UIBadge, { size: "md" }, "Badge"));
    const lg = renderToStaticMarkup(createElement(UIBadge, { size: "lg" }, "Badge"));
    const radiusNone = renderToStaticMarkup(createElement(UIBadge, { borderRadius: "none" }, "Badge"));
    const radiusMd = renderToStaticMarkup(createElement(UIBadge, { borderRadius: "md" }, "Badge"));
    const radiusLg = renderToStaticMarkup(createElement(UIBadge, { borderRadius: "lg" }, "Badge"));

    expect(sm).toContain('data-size="sm"');
    expect(sm).toContain("height:1.5rem");
    expect(md).toContain('data-size="md"');
    expect(md).toContain("height:1.75rem");
    expect(lg).toContain('data-size="lg"');
    expect(lg).toContain("height:2rem");
    expect(radiusNone).toContain('data-border-radius="none"');
    expect(radiusNone).toContain("border-radius:0px");
    expect(radiusMd).toContain('data-border-radius="md"');
    expect(radiusMd).toContain("border-radius:8px");
    expect(radiusLg).toContain('data-border-radius="lg"');
    expect(radiusLg).toContain("border-radius:20px");
  });

  it("applies variant/theme classes", () => {
    const outlinedPrimary = renderToStaticMarkup(
      createElement(UIBadge, { variant: "outlined", theme: "primary" }, "Primary")
    );
    const containedDanger = renderToStaticMarkup(
      createElement(UIBadge, { variant: "contained", theme: "danger" }, "Danger")
    );

    expect(outlinedPrimary).toContain('data-theme="primary"');
    expect(outlinedPrimary).toContain('data-variant="outlined"');
    expect(containedDanger).toContain('data-theme="danger"');
    expect(containedDanger).toContain('data-variant="contained"');
  });
});
