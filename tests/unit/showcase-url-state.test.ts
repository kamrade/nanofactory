import { describe, expect, it } from "vitest";

import {
  appendSearchParamsToPath,
  appendShowcaseStateToPath,
  resolveShowcaseStateFromSearchParams,
} from "@/app/showcase/_shared/showcase-url-state";

describe("showcase url state", () => {
  it("resolves query state with fallback values", () => {
    expect(
      resolveShowcaseStateFromSearchParams(
        {
          theme: "sunwash",
          mode: "dark",
        },
        {
          theme: "forest",
          mode: "light",
        }
      )
    ).toEqual({
      theme: "sunwash",
      mode: "dark",
    });

    expect(resolveShowcaseStateFromSearchParams({}, { theme: "forest", mode: "light" })).toEqual({
      theme: "forest",
      mode: "light",
    });
  });

  it("appends theme and mode to a path", () => {
    expect(
      appendShowcaseStateToPath("/showcase/components/typography-headings?size=md", {
        theme: "sunwash",
        mode: "dark",
      })
    ).toBe("/showcase/components/typography-headings?size=md&theme=sunwash&mode=dark");
  });

  it("merges arbitrary search params into a path", () => {
    const searchParams = new URLSearchParams("theme=sunwash&mode=dark");

    expect(appendSearchParamsToPath("/showcase/layouts/form-layout?foo=bar", searchParams)).toBe(
      "/showcase/layouts/form-layout?foo=bar&theme=sunwash&mode=dark"
    );
  });
});
