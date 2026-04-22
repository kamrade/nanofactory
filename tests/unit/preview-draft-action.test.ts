import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssetUploadError } from "../../src/lib/assets";
import { createPreviewDraft, getPreviewDraft } from "../../src/lib/preview-drafts";
import { createProjectPreviewDraftForUserWithDependencies } from "../../src/lib/project-preview";

function resetDraftStore() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).__previewDraftStore = new Map();
}

describe("createProjectPreviewDraftForUserWithDependencies", () => {
  beforeEach(() => {
    resetDraftStore();
  });

  it("returns an error for invalid JSON", async () => {
    const result = await createProjectPreviewDraftForUserWithDependencies(
      "project-1",
      "user-1",
      "{",
      {
        getProjectByIdForUser: vi.fn(),
        validateHeroAssetReferencesForProject: vi.fn(),
        createPreviewDraft: vi.fn(),
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Content payload must be valid JSON.",
    });
  });

  it("returns an error when the project is missing", async () => {
    const result = await createProjectPreviewDraftForUserWithDependencies(
      "project-1",
      "user-1",
      JSON.stringify({ blocks: [] }),
      {
        getProjectByIdForUser: vi.fn().mockResolvedValue(null),
        validateHeroAssetReferencesForProject: vi.fn(),
        createPreviewDraft: vi.fn(),
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Project not found.",
    });
  });

  it("creates a preview draft when content is valid", async () => {
    const result = await createProjectPreviewDraftForUserWithDependencies(
      "project-1",
      "user-1",
      JSON.stringify({
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Drafted",
            },
          },
        ],
      }),
      {
        getProjectByIdForUser: vi.fn().mockResolvedValue({ id: "project-1" }),
        validateHeroAssetReferencesForProject: vi.fn().mockResolvedValue(undefined),
        createPreviewDraft: vi.fn((input) => createPreviewDraft(input)),
      }
    );

    expect(result.status).toBe("success");

    if (result.status === "success") {
      const draft = getPreviewDraft(result.token);
      expect(draft).not.toBeNull();
      expect(draft?.projectId).toBe("project-1");
      expect(draft?.userId).toBe("user-1");
    }
  });

  it("returns an error when asset validation fails", async () => {
    const result = await createProjectPreviewDraftForUserWithDependencies(
      "project-1",
      "user-1",
      JSON.stringify({
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Drafted",
              imageAssetId: "asset-123",
            },
          },
        ],
      }),
      {
        getProjectByIdForUser: vi.fn().mockResolvedValue({ id: "project-1" }),
        validateHeroAssetReferencesForProject: vi
          .fn()
          .mockRejectedValue(
            new AssetUploadError("Selected asset does not belong to this project.", 400)
          ),
        createPreviewDraft: vi.fn(),
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Selected asset does not belong to this project.",
    });
  });
});
