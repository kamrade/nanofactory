import { describe, expect, it, vi } from "vitest";

import { AssetUploadError } from "@/lib/assets";
import { postAssetWithDependencies } from "@/app/api/projects/[projectId]/assets/route";

describe("postAssetWithDependencies", () => {
  it("uploads an asset and returns 201 with the created asset", async () => {
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi.fn().mockResolvedValue({
      id: "asset-1",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      storageKey: "projects/550e8400-e29b-41d4-a716-446655440000/assets/asset-1.webp",
      originalFilename: "hero.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: null,
      publicUrl:
        "https://assets.example.com/projects/550e8400-e29b-41d4-a716-446655440000/assets/asset-1.webp",
    });

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(uploadAssetForProject).toHaveBeenCalledWith({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
    });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      asset: {
        id: "asset-1",
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        storageKey: "projects/550e8400-e29b-41d4-a716-446655440000/assets/asset-1.webp",
        originalFilename: "hero.webp",
        mimeType: "image/webp",
        sizeBytes: 1024,
        width: null,
        height: null,
        alt: null,
        publicUrl:
          "https://assets.example.com/projects/550e8400-e29b-41d4-a716-446655440000/assets/asset-1.webp",
      },
    });
  });

  it("returns the asset upload error status and message", async () => {
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi
      .fn()
      .mockRejectedValue(new AssetUploadError("Unsupported file type.", 400));

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(uploadAssetForProject).toHaveBeenCalledWith({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
    });
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Unsupported file type.",
    });
  });
});
