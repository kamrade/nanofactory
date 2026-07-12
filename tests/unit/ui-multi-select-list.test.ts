import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIMultiSelectList } from "@/components/ui/multi-select-list";

describe("UIMultiSelectList", () => {
  it("renders with size-dependent option heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        size: "sm",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const mediumHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        size: "md",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        size: "lg",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(smallHtml).toContain("min-h-7");
    expect(mediumHtml).toContain("min-h-10");
    expect(largeHtml).toContain("min-h-14");
  });

  it("renders matching border radius values", () => {
    const noneHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "none",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const mdHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "md",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const lgHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "lg",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(noneHtml).toContain("rounded-none");
    expect(mdHtml).toContain("rounded-lg");
    expect(lgHtml).toContain("rounded-xl");
  });

  it("applies border radius to selected checkbox markers", () => {
    const noneHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "none",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const mdHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "md",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const lgHtml = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        borderRadius: "lg",
        defaultValue: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(noneHtml).toContain("rounded-none");
    expect(mdHtml).toContain("rounded-[4px]");
    expect(lgHtml).toContain("rounded-[6px]");
  });

  it("renders listbox semantics for multiselect", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        ariaLabel: "Skills",
        defaultValue: ["react"],
        options: [
          { value: "react", label: "React" },
          { value: "typescript", label: "TypeScript" },
        ],
      })
    );

    expect(html).toContain('role="listbox"');
    expect(html).toContain('aria-multiselectable="true"');
    expect(html).toContain('role="option"');
  });

  it("marks list as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        invalid: true,
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("border-danger-line");
    expect(html).toContain("bg-danger-100");
  });

  it("renders selected option state", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        value: ["react"],
        options: [
          { value: "react", label: "React" },
          { value: "nextjs", label: "Next.js" },
        ],
      })
    );

    expect(html).toContain('aria-selected="true"');
    expect(html).toContain("bg-primary-100");
  });

  it("renders search input when searchable is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        searchable: true,
        searchPlaceholder: "Find items...",
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('placeholder="Find items..."');
  });

  it("renders hidden inputs when name prop is provided", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelectList, {
        name: "skills",
        value: ["react", "typescript"],
        options: [
          { value: "react", label: "React" },
          { value: "typescript", label: "TypeScript" },
        ],
      })
    );

    expect(html).toContain('type="hidden"');
    expect(html).toContain('name="skills"');
    expect(html).toContain('value="react"');
    expect(html).toContain('value="typescript"');
  });
});
