import { describe, expect, it } from "vitest";

import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";

describe("resolveGalleryItemLinkModeByHost", () => {
  it("returns absolute for platform hosts", () => {
    expect(resolveGalleryItemLinkModeByHost("app.olala.beauty")).toBe("absolute");
    expect(resolveGalleryItemLinkModeByHost("localhost:3010")).toBe("absolute");
    expect(resolveGalleryItemLinkModeByHost("127.0.0.1:3010")).toBe("absolute");
  });

  it("returns relative for custom domains", () => {
    expect(resolveGalleryItemLinkModeByHost("olala.beauty")).toBe("relative");
    expect(resolveGalleryItemLinkModeByHost("www.olala.beauty")).toBe("relative");
  });

  it("falls back to relative when host is empty", () => {
    expect(resolveGalleryItemLinkModeByHost(undefined)).toBe("relative");
    expect(resolveGalleryItemLinkModeByHost(null)).toBe("relative");
    expect(resolveGalleryItemLinkModeByHost("")).toBe("relative");
  });
});

