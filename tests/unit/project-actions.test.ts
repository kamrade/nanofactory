import { describe, expect, it, vi } from "vitest";

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
});
