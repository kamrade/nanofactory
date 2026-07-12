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

    expect(smallHtml).toContain("h-7");
    expect(mediumHtml).toContain("h-10");
    expect(largeHtml).toContain("h-14");
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

    expect(noneHtml).toContain("rounded-none");
    expect(mdHtml).toContain("rounded-lg");
    expect(lgHtml).toContain("rounded-xl");
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

    expect(html).toContain("text-text-main");
  });

  it("marks trigger as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        invalid: true,
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("border-danger-line");
    expect(html).toContain("bg-danger-100");
  });

  it("renders without borders when borderless is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UISelect, {
        borderless: true,
        defaultValue: "react",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).not.toContain("px-2");
    expect(html).not.toContain("px-3");
    expect(html).not.toContain("border-neutral-line");
    expect(html).not.toContain("border-danger-line");
    expect(html).not.toContain("border-primary-line");
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
