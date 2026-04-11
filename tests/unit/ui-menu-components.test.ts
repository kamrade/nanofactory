import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";
import { UIMenuList } from "@/components/ui/menu-list";

describe("UI menu components", () => {
  it("renders menu label and separator", () => {
    const labelHtml = renderToStaticMarkup(createElement(UIMenuLabel, null, "Actions"));
    const separatorHtml = renderToStaticMarkup(createElement(UIMenuSeparator));

    expect(labelHtml).toContain("Actions");
    expect(labelHtml).toContain("text-text-muted");
    expect(separatorHtml).toContain('role="separator"');
    expect(separatorHtml).toContain("bg-line");
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
    expect(html).toContain("text-danger");
    expect(html).toContain("hover:bg-danger-100");
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
    expect(html).toContain("Edit");
    expect(html).toContain("Archive");
    expect(html).toContain("Delete");
  });
});
