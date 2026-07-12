import { describe, expect, it } from "vitest";

import {
  applyShowcaseUiStateToSearchParams,
  resolveShowcaseUiStateFromSearchParams,
} from "@/app/showcase/_shared/showcase-ui-state";

describe("showcase ui state", () => {
  it("resolves defaults from missing search params", () => {
    expect(resolveShowcaseUiStateFromSearchParams({})).toEqual({
      uiSize: "sm",
      borderRadius: "lg",
    });
  });

  it("resolves valid search params and legacy fallback", () => {
    expect(
      resolveShowcaseUiStateFromSearchParams({
        size: "lg",
        borderRadius: "md",
      })
    ).toEqual({
      uiSize: "lg",
      borderRadius: "md",
    });

    expect(
      resolveShowcaseUiStateFromSearchParams({
        size: "md",
        uiBorderRadius: "none",
      })
    ).toEqual({
      uiSize: "md",
      borderRadius: "none",
    });
  });

  it("applies ui state using the dedicated url key", () => {
    const searchParams = new URLSearchParams();
    applyShowcaseUiStateToSearchParams(searchParams, {
      uiSize: "lg",
      borderRadius: "md",
    });

    expect(searchParams.get("size")).toBe("lg");
    expect(searchParams.get("borderRadius")).toBe("md");
  });
});
