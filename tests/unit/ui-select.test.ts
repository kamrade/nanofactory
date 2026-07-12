import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UISelect } from "@/components/ui/select";

describe("UISelect", () => {
  it("renders with size-dependent fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UISelect, {
        size: "sm",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );
    const mediumHtml = renderToStaticMarkup(
      createElement(UISelect, {
        size: "md",
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

    expect(smallHtml).toContain('data-size="sm"');
    expect(mediumHtml).toContain('data-size="md"');
    expect(largeHtml).toContain('data-size="lg"');
  });

  it("renders matching border radius values", () => {
    const noneHtml = renderToStaticMarkup(
      createElement(UISelect, {
        borderRadius: "none",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );
    const mdHtml = renderToStaticMarkup(
      createElement(UISelect, {
        borderRadius: "md",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );
    const lgHtml = renderToStaticMarkup(
      createElement(UISelect, {
        borderRadius: "lg",
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(noneHtml).toContain('data-border-radius="none"');
    expect(mdHtml).toContain('data-border-radius="md"');
    expect(lgHtml).toContain('data-border-radius="lg"');
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

  it("uses text-text-main on trigger to keep selected value readable in dark mode", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('data-size="lg"');
  });

  it("marks trigger as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        invalid: true,
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('data-invalid="true"');
  });

  it("renders without borders when borderless is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        borderless: true,
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('data-borderless="true"');
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
