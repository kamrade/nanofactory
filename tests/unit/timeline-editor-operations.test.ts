import { describe, expect, it } from "vitest";

import {
  addTimelineItem,
  removeTimelineItem,
  updateTimelineItem,
} from "@/features/blocks/timeline/default/editor-operations";

describe("timeline editor operations", () => {
  it("addTimelineItem appends a blank step", () => {
    const next = addTimelineItem([
      { meta: "01", date: "Q1 2026", status: "Planned", title: "Step 1", content: "First step" },
    ]);

    expect(next).toHaveLength(2);
    expect(next[1]).toEqual({
      meta: "",
      date: "",
      status: "",
      title: "",
      content: "",
    });
  });

  it("updateTimelineItem replaces a step by index and preserves others", () => {
    const items = [
      { meta: "01", date: "Q1 2026", status: "Planned", title: "Step 1", content: "First step" },
      { meta: "02", date: "Q2 2026", status: "In progress", title: "Step 2", content: "Second step" },
    ];

    const next = updateTimelineItem(items, 1, {
      meta: "02",
      date: "Q2 2026",
      status: "In progress",
      title: "Updated",
      content: "Updated content",
    });

    expect(next[0]).toEqual(items[0]);
    expect(next[1]).toEqual({
      meta: "02",
      date: "Q2 2026",
      status: "In progress",
      title: "Updated",
      content: "Updated content",
    });
  });

  it("removeTimelineItem removes a step by index and ignores invalid indexes", () => {
    const items = [
      { meta: "01", date: "Q1 2026", status: "Planned", title: "Step 1", content: "First step" },
      { meta: "02", date: "Q2 2026", status: "In progress", title: "Step 2", content: "Second step" },
    ];

    expect(removeTimelineItem(items, 0)).toEqual([items[1]]);
    expect(removeTimelineItem(items, -1)).toBe(items);
    expect(removeTimelineItem(items, 99)).toBe(items);
  });
});
