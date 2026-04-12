import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIButton } from "@/components/ui/button";
import { UIConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  UIDialog,
  UIDialogClose,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
  UIDialogTrigger,
} from "@/components/ui/dialog";

describe("UIDialog", () => {
  it("renders dialog semantics when open", () => {
    const html = renderToStaticMarkup(
      createElement(
        UIDialog,
        { defaultOpen: true },
        createElement(
          UIDialogTrigger,
          null,
          createElement(UIButton, { theme: "base", variant: "outlined", size: "sm" }, "Open")
        ),
        createElement(
          UIDialogContent,
          null,
          createElement(
            UIDialogHeader,
            null,
            createElement(UIDialogTitle, null, "Dialog title"),
            createElement(UIDialogDescription, null, "Dialog description")
          ),
          createElement(
            UIDialogFooter,
            null,
            createElement(
              UIDialogClose,
              null,
              createElement(UIButton, { theme: "base", variant: "outlined", size: "sm" }, "Close")
            )
          )
        )
      )
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("Dialog title");
    expect(html).toContain("Dialog description");
  });

  it("renders confirm dialog trigger", () => {
    const html = renderToStaticMarkup(
      createElement(UIConfirmDialog, {
        trigger: createElement(
          UIButton,
          { theme: "danger", variant: "outlined", size: "sm" },
          "Open confirm"
        ),
        title: "Delete item?",
        description: "This action cannot be undone.",
      })
    );

    expect(html).toContain("Open confirm");
    expect(html).toContain('aria-haspopup="dialog"');
  });
});

