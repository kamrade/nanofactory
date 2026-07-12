import { describe, expect, it } from "vitest";

import {
  applyShowcaseStateToSearchParams,
  resolveShowcaseStateFromSearchParams,
} from "@/app/showcase/_shared/showcase-state";

describe("showcase state", () => {
  it("resolves canonical query params", () => {
    expect(
      resolveShowcaseStateFromSearchParams({
        theme: "sunwash",
        mode: "dark",
        size: "lg",
        borderRadius: "md",
        surfaceStyle: "flat",
        headingFont: "playfair-display",
      })
    ).toEqual({
      theme: "sunwash",
      mode: "dark",
      size: "lg",
      borderRadius: "md",
      surfaceStyle: "flat",
      headingFont: "playfair-display",
    });
  });

  it("supports legacy aliases for shared controls", () => {
    expect(
      resolveShowcaseStateFromSearchParams({
        spacingScale: "sm",
        uiBorderRadius: "none",
      })
    ).toMatchObject({
      size: "sm",
      borderRadius: "none",
    });
  });

  it("serializes the canonical query shape", () => {
    const searchParams = new URLSearchParams();

    applyShowcaseStateToSearchParams(searchParams, {
      theme: "sunwash",
      mode: "light",
      size: "md",
      borderRadius: "lg",
      surfaceStyle: "default",
      headingFont: "onest",
    });

    expect(searchParams.toString()).toBe(
      "theme=sunwash&mode=light&size=md&borderRadius=lg&surfaceStyle=default&headingFont=onest"
    );
  });
});

