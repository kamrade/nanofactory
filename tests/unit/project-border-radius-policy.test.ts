import { describe, expect, it } from "vitest";

import {
  isProjectBorderRadiusPolicy,
  resolveProjectBorderRadiusPolicy,
} from "../../src/lib/projects/border-radius-policy";

describe("project border radius policy", () => {
  it("accepts supported policies", () => {
    expect(isProjectBorderRadiusPolicy("none")).toBe(true);
    expect(isProjectBorderRadiusPolicy("md")).toBe(true);
    expect(isProjectBorderRadiusPolicy("lg")).toBe(true);
  });

  it("rejects unsupported values", () => {
    expect(isProjectBorderRadiusPolicy("xl")).toBe(false);
    expect(isProjectBorderRadiusPolicy("")).toBe(false);
    expect(isProjectBorderRadiusPolicy(null)).toBe(false);
  });

  it("falls back to lg for invalid input", () => {
    expect(resolveProjectBorderRadiusPolicy("none")).toBe("none");
    expect(resolveProjectBorderRadiusPolicy("md")).toBe("md");
    expect(resolveProjectBorderRadiusPolicy("lg")).toBe("lg");
    expect(resolveProjectBorderRadiusPolicy("xl")).toBe("lg");
    expect(resolveProjectBorderRadiusPolicy(undefined)).toBe("lg");
  });
});

