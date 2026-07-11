import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { GenericBlockEditor } from "@/features/blocks/shared/editor/generic-editor";

describe("GenericBlockEditor", () => {
  it("renders inputs and textareas using theme token classes", () => {
    const html = renderToStaticMarkup(
      createElement(GenericBlockEditor, {
        block: {
          id: "hero-1",
          type: "hero",
          variant: "default",
          props: {
            title: "Hero title",
            subtitle: "Hero subtitle",
            items: ["One", "Two"],
          },
        },
        assets: [],
        definition: {
          fields: [
            { key: "title", label: "Title", kind: "text", placeholder: "Title" },
            { key: "subtitle", label: "Subtitle", kind: "textarea", placeholder: "Subtitle" },
            { key: "items", label: "Items", kind: "string-list", placeholder: "One per line" },
          ],
          supportsAssetSelection: false,
        },
        onChange: vi.fn(),
      })
    );

    expect(html).toContain("text-text-main");
    expect(html).toContain("bg-surface");
    expect(html).toContain("border-line");
    expect(html).toContain("focus-within:border-neutral-400");
    expect(html).toContain("Enter one list item per line.");
    expect(html).toContain("text-text-muted");
  });
});
