import { describe, expect, it, vi } from "vitest";

import { AssetUploadError } from "@/lib/assets";
import { saveProjectContentForUserWithDependencies } from "@/app/(protected)/projects/[projectId]/actions";

describe("saveProjectContentForUserWithDependencies", () => {
  it("saves valid content and revalidates project paths", async () => {
    const validateHeroAssetReferencesForProject = vi.fn().mockResolvedValue(undefined);
    const saveProjectContentForUser = vi.fn().mockResolvedValue({
      id: "content-1",
    });
    const revalidatePath = vi.fn();

    const formData = new FormData();
    formData.set(
      "content",
      JSON.stringify({
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Saved hero",
            },
          },
        ],
      })
    );

    const result = await saveProjectContentForUserWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      formData,
      {
        validateHeroAssetReferencesForProject,
        saveProjectContentForUser,
        revalidatePath,
      }
    );

    expect(result).toEqual({
      status: "success",
      message: "Project content saved.",
    });
    expect(validateHeroAssetReferencesForProject).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      {
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            variant: "default",
            fullBleed: false,
            props: {
              title: "Saved hero",
              subtitle:
                "Write the core message, add a call to action, and publish a focused landing page without a long setup.",
              buttonText: "Start now",
              imageAssetId: undefined,
            },
          },
        ],
      }
    );
    expect(saveProjectContentForUser).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      {
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            variant: "default",
            fullBleed: false,
            props: {
              title: "Saved hero",
              subtitle:
                "Write the core message, add a call to action, and publish a focused landing page without a long setup.",
              buttonText: "Start now",
              imageAssetId: undefined,
            },
          },
        ],
      }
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      "/projects/550e8400-e29b-41d4-a716-446655440000"
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("returns an error when asset validation fails", async () => {
    const validateHeroAssetReferencesForProject = vi
      .fn()
      .mockRejectedValue(
        new AssetUploadError("Selected asset does not belong to this project.", 400)
      );
    const saveProjectContentForUser = vi.fn();
    const revalidatePath = vi.fn();

    const formData = new FormData();
    formData.set(
      "content",
      JSON.stringify({
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Saved hero",
              imageAssetId: "asset-1",
            },
          },
        ],
      })
    );

    const result = await saveProjectContentForUserWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      formData,
      {
        validateHeroAssetReferencesForProject,
        saveProjectContentForUser,
        revalidatePath,
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Selected asset does not belong to this project.",
    });
    expect(saveProjectContentForUser).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when content payload is missing", async () => {
    const validateHeroAssetReferencesForProject = vi.fn();
    const saveProjectContentForUser = vi.fn();
    const revalidatePath = vi.fn();

    const formData = new FormData();

    const result = await saveProjectContentForUserWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      formData,
      {
        validateHeroAssetReferencesForProject,
        saveProjectContentForUser,
        revalidatePath,
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Missing content payload.",
    });
    expect(validateHeroAssetReferencesForProject).not.toHaveBeenCalled();
    expect(saveProjectContentForUser).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error for invalid JSON payload", async () => {
    const validateHeroAssetReferencesForProject = vi.fn();
    const saveProjectContentForUser = vi.fn();
    const revalidatePath = vi.fn();

    const formData = new FormData();
    formData.set("content", "{invalid-json");

    const result = await saveProjectContentForUserWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      formData,
      {
        validateHeroAssetReferencesForProject,
        saveProjectContentForUser,
        revalidatePath,
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Content payload must be valid JSON.",
    });
    expect(validateHeroAssetReferencesForProject).not.toHaveBeenCalled();
    expect(saveProjectContentForUser).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when project is not found", async () => {
    const validateHeroAssetReferencesForProject = vi.fn().mockResolvedValue(undefined);
    const saveProjectContentForUser = vi.fn().mockResolvedValue(null);
    const revalidatePath = vi.fn();

    const formData = new FormData();
    formData.set(
      "content",
      JSON.stringify({
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Saved hero",
            },
          },
        ],
      })
    );

    const result = await saveProjectContentForUserWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      formData,
      {
        validateHeroAssetReferencesForProject,
        saveProjectContentForUser,
        revalidatePath,
      }
    );

    expect(result).toEqual({
      status: "error",
      message: "Project not found.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
