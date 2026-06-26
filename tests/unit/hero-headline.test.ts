import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeroHeadline } from "@/features/blocks/hero/shared/hero-headline";
import styles from "@/features/blocks/hero/shared/hero-headline.module.css";

describe("HeroHeadline", () => {
  it("renders plain text with the default variant classes", () => {
    const html = renderToStaticMarkup(
      createElement(HeroHeadline, {
        text: "Build faster",
        variant: "default",
      })
    );

    expect(html).toContain("Build faster");
    expect(html).toContain(styles.headline);
    expect(html).toContain(styles.default);
    expect(html).not.toContain('role="text"');
  });

  it("renders animated text with the centered variant classes", () => {
    const html = renderToStaticMarkup(
      createElement(HeroHeadline, {
        text: "Animate me",
        variant: "centered",
        animateMainText: true,
      })
    );

    expect(html).toContain(styles.headline);
    expect(html).toContain(styles.centered);
    expect(html).toContain('role="text"');
    expect(html).toContain('aria-label="Animate me"');
    expect(html).toContain("typewriter-cursor");
  });
});
