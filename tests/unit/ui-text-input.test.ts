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

    expect(smallHtml).toContain('data-size="sm"');
    expect(mediumHtml).toContain('data-size="md"');
    expect(largeHtml).toContain('data-size="lg"');
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

    expect(noneHtml).toContain('data-border-radius="none"');
    expect(mdHtml).toContain('data-border-radius="md"');
    expect(lgHtml).toContain('data-border-radius="lg"');
  });

  it("marks input as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { invalid: true, defaultValue: "john@" })
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('data-invalid="true"');
  });

  it("renders without borders when borderless is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { borderless: true, defaultValue: "borderless" })
    );

    expect(html).toContain('data-borderless="true"');
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
