import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UITextInput } from "@/components/ui/text-input";

describe("UITextInput", () => {
  it("renders with small and large fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UITextInput, { size: "sm", defaultValue: "a" })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UITextInput, { size: "lg", defaultValue: "a" })
    );

    expect(smallHtml).toContain("h-7");
    expect(largeHtml).toContain("h-10");
  });

  it("marks input as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UITextInput, { invalid: true, defaultValue: "john@" })
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("border-danger-line");
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
