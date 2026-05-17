import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GalleryItemNav } from "../../src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/gallery-item-nav";

describe("GalleryItemNav", () => {
  it("renders Back/Item/Previous/Next controls with test ids", () => {
    const html = renderToStaticMarkup(
      GalleryItemNav({
        backHref: "/p/demo#gallery-1",
        counterText: "Item 1 of 3",
        previousHref: "/p/demo/gallery-1/item-1",
        nextHref: "/p/demo/gallery-1/item-2",
      })
    );

    expect(html).toContain('data-testid="gallery-back-link"');
    expect(html).toContain('data-testid="gallery-counter"');
    expect(html).toContain('data-testid="gallery-nav-previous"');
    expect(html).toContain('data-testid="gallery-nav-next"');
    expect(html).toContain("Back to gallery");
    expect(html).toContain("Item 1 of 3");
    expect(html).toContain("Previous");
    expect(html).toContain("Next");
  });

  it("applies spacing classes to controls for sm/md/lg presets", () => {
    const smHtml = renderToStaticMarkup(
      GalleryItemNav({
        backHref: "/p/demo#gallery-1",
        counterText: "Item 1 of 3",
        previousHref: "/p/demo/gallery-1/item-1",
        nextHref: "/p/demo/gallery-1/item-2",
        controlClassName: "px-2 py-1.5 text-xs",
        controlBarClassName: "px-2 py-2",
      })
    );
    const mdHtml = renderToStaticMarkup(
      GalleryItemNav({
        backHref: "/p/demo#gallery-1",
        counterText: "Item 1 of 3",
        previousHref: "/p/demo/gallery-1/item-1",
        nextHref: "/p/demo/gallery-1/item-2",
        controlClassName: "px-3 py-2 text-sm",
        controlBarClassName: "px-4 py-3",
      })
    );
    const lgHtml = renderToStaticMarkup(
      GalleryItemNav({
        backHref: "/p/demo#gallery-1",
        counterText: "Item 1 of 3",
        previousHref: "/p/demo/gallery-1/item-1",
        nextHref: "/p/demo/gallery-1/item-2",
        controlClassName: "px-4 py-3 text-base",
        controlBarClassName: "px-5 py-4",
      })
    );

    expect(smHtml).toContain("px-2 py-1.5 text-xs");
    expect(smHtml).toContain("px-2 py-2");
    expect(mdHtml).toContain("px-3 py-2 text-sm");
    expect(mdHtml).toContain("px-4 py-3");
    expect(lgHtml).toContain("px-4 py-3 text-base");
    expect(lgHtml).toContain("px-5 py-4");
  });

  it("renders disabled Previous/Next labels when hrefs are not provided", () => {
    const html = renderToStaticMarkup(
      GalleryItemNav({
        backHref: "/p/demo#gallery-1",
        counterText: "Item 1 of 1",
      })
    );

    expect(html).not.toContain('data-testid="gallery-nav-previous"');
    expect(html).not.toContain('data-testid="gallery-nav-next"');
    expect(html).toContain("text-text-placeholder");
  });
});
