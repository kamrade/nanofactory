import { describe, expect, it } from "vitest";

import {
  appendComponentsShowcaseStateToPath,
  resolveComponentsShowcaseStateFromSearchParams,
} from "@/app/showcase/_shared/components/url-state";

describe("components url state", () => {
  it("resolves defaults from missing search params", () => {
    expect(resolveComponentsShowcaseStateFromSearchParams({})).toEqual({
      uiSize: "sm",
      borderRadius: "lg",
    });
  });

  it("resolves valid search params", () => {
    expect(
      resolveComponentsShowcaseStateFromSearchParams({
        size: "md",
        borderRadius: "none",
      })
    ).toEqual({
      uiSize: "md",
      borderRadius: "none",
    });
  });

  it("appends the current state to component links", () => {
    expect(
      appendComponentsShowcaseStateToPath("/showcase/components/typography-buttons?foo=bar", {
        uiSize: "lg",
        borderRadius: "md",
      })
    ).toBe("/showcase/components/typography-buttons?foo=bar&size=lg&borderRadius=md");
  });
});
