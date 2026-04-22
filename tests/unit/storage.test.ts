import { describe, expect, it, vi } from "vitest";

describe("storage helpers", () => {
  it("builds a project-scoped storage key with a sanitized extension", async () => {
    const randomUuidSpy = vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    const { buildStorageKey } = await import("../../src/lib/storage/keys");

    expect(
      buildStorageKey({
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        extension: ".WEBP",
      })
    ).toBe(
      "projects/550e8400-e29b-41d4-a716-446655440000/assets/123e4567-e89b-12d3-a456-426614174000.webp"
    );

    randomUuidSpy.mockRestore();
  });

  it("builds a public asset url from the configured base url", async () => {
    const previousAccountId = process.env.R2_ACCOUNT_ID;
    const previousAccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const previousSecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const previousBucketName = process.env.R2_BUCKET_NAME;
    const previousEndpoint = process.env.R2_ENDPOINT;
    const previousEnv = process.env.R2_PUBLIC_BASE_URL;

    process.env.R2_ACCOUNT_ID = "test-account";
    process.env.R2_ACCESS_KEY_ID = "test-access-key";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.R2_BUCKET_NAME = "test-bucket";
    process.env.R2_ENDPOINT = "https://test-account.eu.r2.cloudflarestorage.com";
    process.env.R2_PUBLIC_BASE_URL = "https://assets.example.com/";

    vi.resetModules();
    const { buildPublicAssetUrl } = await import("../../src/lib/storage/urls");

    expect(
      buildPublicAssetUrl(
        "projects/550e8400-e29b-41d4-a716-446655440000/assets/hero image.webp"
      )
    ).toBe(
      "https://assets.example.com/projects/550e8400-e29b-41d4-a716-446655440000/assets/hero%20image.webp"
    );

    process.env.R2_ACCOUNT_ID = previousAccountId;
    process.env.R2_ACCESS_KEY_ID = previousAccessKeyId;
    process.env.R2_SECRET_ACCESS_KEY = previousSecretAccessKey;
    process.env.R2_BUCKET_NAME = previousBucketName;
    process.env.R2_ENDPOINT = previousEndpoint;
    process.env.R2_PUBLIC_BASE_URL = previousEnv;
    vi.resetModules();
  });
});
