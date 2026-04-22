import { describe, expect, it } from "vitest";

import { AssetUploadError, validateAssetFile } from "../../src/lib/assets";

describe("asset upload validation", () => {
  it("rejects unsupported mime types", () => {
    const file = new File(["svg"], "icon.svg", {
      type: "image/svg+xml",
    });

    expect(() => validateAssetFile(file)).toThrow(AssetUploadError);
  });

  it("accepts supported files and returns normalized metadata", () => {
    const file = new File(["image"], "Hero Banner.WEBP", {
      type: "image/webp",
    });

    expect(validateAssetFile(file)).toMatchObject({
      originalFilename: "Hero Banner.WEBP",
      mimeType: "image/webp",
      extension: "webp",
      sizeBytes: file.size,
    });
  });
});
