import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIAutocomplete } from "@/components/ui/autocomplete";

describe("UIAutocomplete", () => {
  it("renders with small and large fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        size: "sm",
        value: "re",
        items: [{ value: "react", label: "React" }],
      })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        size: "lg",
        value: "re",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(smallHtml).toContain("h-7");
    expect(largeHtml).toContain("h-10");
  });

  it("renders combobox and listbox semantics", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        ariaLabel: "Framework autocomplete",
        value: "re",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
  });

  it("renders invalid styles", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        invalid: true,
        value: "re",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("border-danger-line");
    expect(html).toContain("bg-danger-100");
  });

  it("renders clear control slot when clearable is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        clearable: true,
        value: "re",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("Clear autocomplete");
  });

  it("renders loading indicator", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        loading: true,
        value: "rea",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("animate-spin");
    expect(html).toContain("border-t-primary-200");
  });

  it("passes name and placeholder to the input", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        name: "framework",
        placeholder: "Find framework",
        value: "",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('name="framework"');
    expect(html).toContain('placeholder="Find framework"');
  });

  it("keeps clear control visually hidden when value is empty", () => {
    const html = renderToStaticMarkup(
      createElement(UIAutocomplete, {
        clearable: true,
        value: "",
        items: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("pointer-events-none");
    expect(html).toContain("opacity-0");
  });
});
