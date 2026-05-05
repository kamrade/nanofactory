import { describe, expect, it } from "vitest";

import { buildEffectiveAnchorMap } from "@/lib/editor/anchor-id";

describe("buildEffectiveAnchorMap", () => {
  it("creates incremental anchors per block type when anchorId is empty", () => {
    const map = buildEffectiveAnchorMap([
      { id: "a", type: "hero" },
      { id: "b", type: "features" },
      { id: "c", type: "hero" },
    ]);

    expect(map.get("a")).toBe("hero-1");
    expect(map.get("b")).toBe("features-1");
    expect(map.get("c")).toBe("hero-2");
  });

  it("keeps valid explicit anchors and avoids collisions for auto anchors", () => {
    const map = buildEffectiveAnchorMap([
      { id: "a", type: "hero", anchorId: "hero-1" },
      { id: "b", type: "hero" },
      { id: "c", type: "hero" },
    ]);

    expect(map.get("a")).toBe("hero-1");
    expect(map.get("b")).toBe("hero-2");
    expect(map.get("c")).toBe("hero-3");
  });
});
