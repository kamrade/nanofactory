import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIButton } from "@/components/ui/button";
import { UIModal, UIModalForm } from "@/components/ui/modal";

describe("UIModal", () => {
  it("renders trigger and dialog semantics when open", () => {
    const html = renderToStaticMarkup(
      createElement(
        UIModal,
        {
          defaultOpen: true,
          trigger: createElement(
            UIButton,
            { theme: "base", variant: "outlined", size: "sm" },
            "Open modal"
          ),
          title: "Modal title",
          description: "Modal description",
        },
        createElement("p", null, "Body content")
      )
    );

    expect(html).toContain("Open modal");
    expect(html).toContain('role="dialog"');
    expect(html).toContain("Modal title");
    expect(html).toContain("Modal description");
    expect(html).toContain("Body content");
  });

  it("renders modal form action buttons", () => {
    const html = renderToStaticMarkup(
      createElement(UIModalForm, {
        defaultOpen: true,
        trigger: createElement(
          UIButton,
          { theme: "primary", variant: "contained", size: "sm" },
          "Open form"
        ),
        title: "Edit data",
        submitLabel: "Save profile",
      }, createElement("div", null, "Fields"))
    );

    expect(html).toContain("Save profile");
    expect(html).toContain("Cancel");
    expect(html).toContain('type="submit"');
  });
});

