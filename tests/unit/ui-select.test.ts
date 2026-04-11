import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UISelect } from "@/components/ui/select";

describe("UISelect", () => {
  it("renders with small and large fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UISelect, {
        size: "sm",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UISelect, {
        size: "lg",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(smallHtml).toContain("h-7");
    expect(largeHtml).toContain("h-10");
  });

  it("uses listbox popup semantics", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        defaultValue: "react",
        ariaLabel: "Framework",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain(">React<");
  });

  it("marks trigger as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        invalid: true,
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("border-danger-line");
  });

  it("renders clear button slot when clearable is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        clearable: true,
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("Clear select");
  });

  it("renders hidden input when name prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        name: "framework",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('type="hidden"');
    expect(html).toContain('name="framework"');
    expect(html).toContain('value="react"');
  });

  it("renders prefix and suffix slots", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        prefix: createElement("span", null, "P"),
        suffix: createElement("span", null, "S"),
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain(">P<");
    expect(html).toContain(">S<");
  });
});
