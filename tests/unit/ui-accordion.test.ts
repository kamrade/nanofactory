import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { UIAccordion } from "@/components/ui/accordion";

describe("UIAccordion", () => {
  it("renders accordion trigger and region semantics", () => {
    const html = renderToStaticMarkup(
      createElement(UIAccordion, {
        ariaLabel: "FAQ",
        defaultValue: "shipping",
        items: [
          {
            id: "shipping",
            title: "Shipping",
            content: "Ships in two days.",
          },
          {
            id: "billing",
            title: "Billing",
            content: "Invoices are emailed.",
          },
        ],
      })
    );

    expect(html).toContain('aria-label="FAQ"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('role="region"');
    expect(html).toContain("Ships in two days.");
    expect(html).toContain("Invoices are emailed.");
  });

  it("renders small accordion spacing classes", () => {
    const html = renderToStaticMarkup(
      createElement(UIAccordion, {
        size: "sm",
        items: [
          {
            id: "shipping",
            title: "Shipping",
            content: "Ships in two days.",
          },
        ],
      })
    );

    expect(html).toContain("px-4 py-3");
    expect(html).toContain("text-sm leading-6");
  });
});
