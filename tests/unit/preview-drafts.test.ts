import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createPreviewDraft, getPreviewDraft } from "../../lib/preview-drafts";

function resetDraftStore() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).__previewDraftStore = new Map();
}

describe("preview drafts", () => {
  beforeEach(() => {
    resetDraftStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates and returns drafts until they expire", () => {
    const draft = createPreviewDraft({
      projectId: "project-1",
      userId: "user-1",
      content: {
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Preview title",
            },
          },
        ],
      },
      ttlMs: 1000,
    });

    const loaded = getPreviewDraft(draft.id);

    expect(loaded).not.toBeNull();
    expect(loaded?.projectId).toBe("project-1");
    expect(loaded?.userId).toBe("user-1");
    expect(loaded?.content.blocks[0]?.props).toMatchObject({
      title: "Preview title",
    });

    vi.advanceTimersByTime(1001);

    expect(getPreviewDraft(draft.id)).toBeNull();
  });
});
