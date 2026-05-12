import { describe, expect, it } from "vitest";

import { resolveGalleryItemMode } from "@/lib/gallery-item/mode";

describe("resolveGalleryItemMode", () => {
  it("prioritizes query mode over referer and cookie", () => {
    const mode = resolveGalleryItemMode({
      searchMode: "dark",
      referer: "https://example.com/p/demo?mode=light",
      cookieMode: "light",
    });

    expect(mode).toBe("dark");
  });

  it("uses referer mode when query mode is not provided", () => {
    const mode = resolveGalleryItemMode({
      referer: "https://example.com/p/demo?mode=dark",
      cookieMode: "light",
    });

    expect(mode).toBe("dark");
  });

  it("falls back to cookie mode when referer is malformed", () => {
    const mode = resolveGalleryItemMode({
      referer: "not-a-valid-url",
      cookieMode: "dark",
    });

    expect(mode).toBe("dark");
  });

  it("falls back to light when nothing valid is provided", () => {
    const mode = resolveGalleryItemMode({
      searchMode: "unknown",
      referer: "https://example.com/p/demo?mode=unknown",
      cookieMode: "light",
    });

    expect(mode).toBe("light");
  });
});
