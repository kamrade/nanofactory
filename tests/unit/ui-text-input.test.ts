import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UITextInput } from "@/components/ui/text-input";

describe("UITextInput", () => {
  it("renders with small and large fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UITextInput, { size: "sm", defaultValue: "a" })
    );
    const mediumHtml = renderToStaticMarkup(
      createElement(UITextInput, { size: "md", defaultValue: "a" })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UITextInput, { size: "lg", defaultValue: "a" })
    );

    expect(smallHtml).toContain("h-7");
    expect(mediumHtml).toContain("h-10");
    expect(largeHtml).toContain("h-14");
  });

  it("renders matching border radius values", () => {
    const noneHtml = renderToStaticMarkup(
      createElement(UITextInput, { borderRadius: "none", defaultValue: "a" })
    );
    const mdHtml = renderToStaticMarkup(
      createElement(UITextInput, { borderRadius: "md", defaultValue: "a" })
    );
    const lgHtml = renderToStaticMarkup(
      createElement(UITextInput, { borderRadius: "lg", defaultValue: "a" })
    );

    expect(noneHtml).toContain("rounded-none");
    expect(mdHtml).toContain("rounded-lg");
    expect(lgHtml).toContain("rounded-xl");
  });

  it("marks input as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { invalid: true, defaultValue: "john@" })
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("border-danger-line");
  });

  it("renders without borders when borderless is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { borderless: true, defaultValue: "borderless" })
    );

    expect(html).not.toContain("px-2");
    expect(html).not.toContain("px-3");
    expect(html).not.toContain("border-line");
    expect(html).not.toContain("border-danger-line");
    expect(html).not.toContain("border-primary-line");
  });

  it("renders clear button slot when clearable is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { clearable: true, defaultValue: "abc" })
    );

    expect(html).toContain("Clear input");
  });

  it("renders password visibility toggle for password fields", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { type: "password", showPasswordToggle: true })
    );

    expect(html).toContain("Show password");
    expect(html).toContain(">Show<");
  });

  it("renders prefix and suffix slots", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, {
        prefix: createElement("span", null, "P"),
        suffix: createElement("span", null, "S"),
      })
    );

    expect(html).toContain(">P<");
    expect(html).toContain(">S<");
  });
});
