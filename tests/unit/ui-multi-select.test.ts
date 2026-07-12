import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIMultiSelect } from "@/components/ui/multi-select";

describe("UIMultiSelect", () => {
  it("renders with size-dependent fixed heights", () => {
    const smallHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        size: "sm",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const mediumHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        size: "md",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const largeHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        size: "lg",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(smallHtml).toContain('data-size="sm"');
    expect(mediumHtml).toContain('data-size="md"');
    expect(largeHtml).toContain('data-size="lg"');
  });

  it("renders matching border radius values", () => {
    const noneHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        borderRadius: "none",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const mdHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        borderRadius: "md",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );
    const lgHtml = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        borderRadius: "lg",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(noneHtml).toContain('data-border-radius="none"');
    expect(mdHtml).toContain('data-border-radius="md"');
    expect(lgHtml).toContain('data-border-radius="lg"');
  });

  it("uses listbox popup semantics", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        ariaLabel: "Stack",
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain(">React<");
  });

  it("renders selected counter when more than two values are selected", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        value: ["react", "typescript", "nextjs"],
        options: [
          { value: "react", label: "React" },
          { value: "typescript", label: "TypeScript" },
          { value: "nextjs", label: "Next.js" },
        ],
      })
    );

    expect(html).toContain("3 selected");
  });

  it("renders clear control slot when clearable is enabled", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        clearable: true,
        value: ["react"],
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain("Clear selected options");
  });

  it("marks trigger as invalid when invalid prop is set", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelect, {
        invalid: true,
        options: [{ value: "react", label: "React" }],
      })
    );

    expect(html).toContain('data-invalid="true"');
  });

  it("renders hidden inputs when name prop is provided", () => {
    const html = renderToStaticMarkup(
      createElement(UIMultiSelect, {
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
