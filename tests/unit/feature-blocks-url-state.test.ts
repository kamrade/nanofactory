import { describe, expect, it } from "vitest";

import {
  applyFeatureBlocksOptionsToSearchParams,
  DEFAULT_FEATURE_BLOCKS_OPTIONS,
  FEATURE_BLOCKS_QUERY_KEYS,
  resolveFeatureBlocksOptionsFromSearchParams,
} from "../../src/app/showcase/_shared/feature-blocks/url-state";

describe("feature blocks url state", () => {
  it("falls back to defaults for invalid search params", () => {
    expect(
      resolveFeatureBlocksOptionsFromSearchParams({
        borderRadius: "xl",
        spacingScale: undefined,
        surfaceStyle: "glass",
        headingFont: "geist",
      })
    ).toEqual(DEFAULT_FEATURE_BLOCKS_OPTIONS);
  });

  it("uses the first value when a query param is repeated", () => {
    expect(
      resolveFeatureBlocksOptionsFromSearchParams({
        borderRadius: ["md", "lg"],
        spacingScale: ["lg", "sm"],
        surfaceStyle: ["flat", "default"],
        headingFont: ["playfair-display", "onest"],
      })
    ).toEqual({
      borderRadiusPolicy: "md",
      spacingScale: "lg",
      surfaceStyle: "flat",
      headingFont: "playfair-display",
    });
  });

  it("serializes feature block options into search params", () => {
    const searchParams = new URLSearchParams("foo=bar");

    applyFeatureBlocksOptionsToSearchParams(searchParams, {
      borderRadiusPolicy: "none",
      spacingScale: "sm",
      surfaceStyle: "flat",
      headingFont: "ibm-plex-mono",
    });

    expect(searchParams.get("foo")).toBe("bar");
    expect(searchParams.get(FEATURE_BLOCKS_QUERY_KEYS.borderRadiusPolicy)).toBe("none");
    expect(searchParams.get(FEATURE_BLOCKS_QUERY_KEYS.spacingScale)).toBe("sm");
    expect(searchParams.get(FEATURE_BLOCKS_QUERY_KEYS.surfaceStyle)).toBe("flat");
    expect(searchParams.get(FEATURE_BLOCKS_QUERY_KEYS.headingFont)).toBe("ibm-plex-mono");
  });
});
