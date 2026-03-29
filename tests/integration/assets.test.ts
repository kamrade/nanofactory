import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createAssetForProject,
  getAssetsByProjectId,
  getAssetsByProjectIdForUser,
} from "../../lib/assets";
import {
  closeTestDatabase,
  getSeededTestUser,
  resetTestDatabase,
  seedProject,
  seedUser,
} from "../helpers/db";

describe("asset metadata queries", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates asset metadata and returns it only to the owner", async () => {
    const owner = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "other.assets@nanofactory.local",
      displayName: "Other Assets User",
    });
    const project = await seedProject({
      userId: owner.id,
      name: "Assets Project",
      slug: "assets-project",
    });

    await createAssetForProject({
      projectId: project.id,
      storageKey: `projects/${project.id}/assets/test-image.webp`,
      originalFilename: "test-image.webp",
      mimeType: "image/webp",
      sizeBytes: 2048,
      width: null,
      height: null,
      alt: null,
    });

    const ownerAssets = await getAssetsByProjectIdForUser(project.id, owner.id);
    const otherAssets = await getAssetsByProjectIdForUser(project.id, otherUser.id);

    expect(ownerAssets).toHaveLength(1);
    expect(ownerAssets[0]).toMatchObject({
      projectId: project.id,
      originalFilename: "test-image.webp",
      mimeType: "image/webp",
      sizeBytes: 2048,
    });
    expect(otherAssets).toHaveLength(0);
  });

  it("returns only assets that belong to the requested project for public resolution", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Public Assets Project",
      slug: "public-assets-project",
    });
    const otherProject = await seedProject({
      userId: owner.id,
      name: "Other Assets Project",
      slug: "other-assets-project",
    });

    const localAsset = await createAssetForProject({
      projectId: project.id,
      storageKey: `projects/${project.id}/assets/local.webp`,
      originalFilename: "local.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: null,
    });

    await createAssetForProject({
      projectId: otherProject.id,
      storageKey: `projects/${otherProject.id}/assets/foreign.webp`,
      originalFilename: "foreign.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: null,
    });

    const projectAssets = await getAssetsByProjectId(project.id);

    expect(projectAssets).toHaveLength(1);
    expect(projectAssets[0]?.id).toBe(localAsset.id);
    expect(projectAssets[0]?.projectId).toBe(project.id);
  });
});
