import { describe, expect, it, vi } from "vitest";

import { AssetUploadError } from "@/lib/assets";
import { postAssetWithDependencies } from "@/app/api/projects/[projectId]/assets/route";

describe("postAssetWithDependencies", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

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

  it("returns 500 for missing bucket errors", async () => {
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi
      .fn()
      .mockRejectedValue({ name: "NoSuchBucket" });

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error:
        "R2 bucket was not found. Check R2_BUCKET_NAME and whether R2_ENDPOINT matches the bucket jurisdiction.",
    });
  });

  it("returns 500 for access denied errors", async () => {
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi
      .fn()
      .mockRejectedValue({ name: "AccessDenied" });

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error:
        "R2 rejected the request. Check R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and bucket permissions.",
    });
  });

  it("returns error details in non-production environments", async () => {
    process.env.NODE_ENV = "development";
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi.fn().mockRejectedValue(new Error("Boom"));

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Boom" });
  });

  it("hides error details in production", async () => {
    process.env.NODE_ENV = "production";
    const file = new File(["image"], "hero.webp", {
      type: "image/webp",
    });
    const uploadAssetForProject = vi.fn().mockRejectedValue(new Error("Boom"));

    const response = await postAssetWithDependencies(
      "550e8400-e29b-41d4-a716-446655440000",
      "7e3b7a0c-7a8c-4b1e-bc27-8a0a1f5c4c2a",
      file,
      {
        uploadAssetForProject,
      }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Upload failed." });
  });
});
