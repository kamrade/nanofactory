import { describe, expect, it } from "vitest";

import {
  isProjectHeadingFont,
  resolveProjectHeadingFont,
} from "../../src/lib/projects/heading-font";

describe("project heading font", () => {
  it("accepts supported fonts", () => {
    expect(isProjectHeadingFont("onest")).toBe(true);
    expect(isProjectHeadingFont("playfair-display")).toBe(true);
    expect(isProjectHeadingFont("ibm-plex-mono")).toBe(true);
  });

  it("rejects unsupported values", () => {
    expect(isProjectHeadingFont("geist")).toBe(false);
    expect(isProjectHeadingFont("")).toBe(false);
    expect(isProjectHeadingFont(null)).toBe(false);
  });

  it("falls back to onest for invalid input", () => {
    expect(resolveProjectHeadingFont("onest")).toBe("onest");
    expect(resolveProjectHeadingFont("playfair-display")).toBe("playfair-display");
    expect(resolveProjectHeadingFont("ibm-plex-mono")).toBe("ibm-plex-mono");
    expect(resolveProjectHeadingFont("geist")).toBe("onest");
    expect(resolveProjectHeadingFont(undefined)).toBe("onest");
  });
});
