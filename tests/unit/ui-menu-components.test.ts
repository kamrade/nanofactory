import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";
import { UIMenuList } from "@/components/ui/menu/menu-list";

describe("UI menu components", () => {
  it("renders menu label and separator", () => {
    const labelHtml = renderToStaticMarkup(createElement(UIMenuLabel, null, "Actions"));
    const separatorHtml = renderToStaticMarkup(createElement(UIMenuSeparator));

    expect(labelHtml).toContain("Actions");
    expect(labelHtml).toContain('data-size="lg"');
    expect(separatorHtml).toContain('role="separator"');
  });

  it("renders menu labels with matching sizes", () => {
    const smHtml = renderToStaticMarkup(createElement(UIMenuLabel, { size: "sm" }, "Actions"));
    const mdHtml = renderToStaticMarkup(createElement(UIMenuLabel, { size: "md" }, "Actions"));
    const lgHtml = renderToStaticMarkup(createElement(UIMenuLabel, { size: "lg" }, "Actions"));

    expect(smHtml).toContain('data-size="sm"');
    expect(mdHtml).toContain('data-size="md"');
    expect(lgHtml).toContain('data-size="lg"');
  });

  it("renders danger menu item styles", () => {
    const html = renderToStaticMarkup(
      createElement(
        UIMenuItem,
        {
          tone: "danger",
          onSelect: () => undefined,
          icon: createElement("span", { "aria-hidden": true }, "i"),
        },
        "Delete"
      )
    );

    expect(html).toContain("Delete");
    expect(html).toContain('data-tone="danger"');
    expect(html).toContain('role="menuitem"');
  });

  it("renders menu item sizes matching button sizing", () => {
    const smHtml = renderToStaticMarkup(createElement(UIMenuItem, { size: "sm", onSelect: () => undefined }, "Small"));
    const mdHtml = renderToStaticMarkup(createElement(UIMenuItem, { size: "md", onSelect: () => undefined }, "Medium"));
    const lgHtml = renderToStaticMarkup(createElement(UIMenuItem, { size: "lg", onSelect: () => undefined }, "Large"));

    expect(smHtml).toContain('data-size="sm"');
    expect(mdHtml).toContain('data-size="md"');
    expect(lgHtml).toContain('data-size="lg"');
  });

  it("renders menu list items and a11y role", () => {
    const html = renderToStaticMarkup(
      createElement(UIMenuList, {
        ariaLabel: "Card actions",
        items: [
          { id: "edit", label: "Edit", textValue: "Edit" },
          { id: "archive", label: "Archive", textValue: "Archive" },
          { id: "delete", label: "Delete", textValue: "Delete", tone: "danger" },
        ],
      })
    );

    expect(html).toContain('role="menu"');
    expect(html).toContain('role="menuitem"');
    expect(html).toContain('data-size="lg"');
    expect(html).toContain("Edit");
    expect(html).toContain("Archive");
    expect(html).toContain("Delete");
  });

  it("renders menu list items with matching sizes", () => {
    const html = renderToStaticMarkup(
      createElement(UIMenuList, {
        size: "lg",
        borderRadius: "md",
        ariaLabel: "Card actions",
        items: [{ id: "edit", label: "Edit", textValue: "Edit" }],
      })
    );

    expect(html).toContain('data-size="lg"');
    expect(html).toContain('data-border-radius="md"');
  });

  it("renders menu list border radius variables for items and surface", () => {
    const html = renderToStaticMarkup(
      createElement(UIMenuList, {
        borderRadius: "lg",
        ariaLabel: "Card actions",
        items: [{ id: "edit", label: "Edit", textValue: "Edit" }],
      })
    );

    expect(html).toContain('data-border-radius="lg"');
    expect(html).toContain("--menu-radius:0.75rem");
    expect(html).toContain("--menu-item-radius:0.75rem");
  });
});
