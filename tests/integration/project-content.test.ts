import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createAssetForProject,
  validateHeroAssetReferencesForProject,
} from "../../src/lib/assets";
import { saveProjectContentForUser, getProjectByIdForUser } from "../../src/lib/projects";
import {
  closeTestDatabase,
  getSeededTestUser,
  resetTestDatabase,
  seedProject,
  seedUser,
} from "../helpers/db";

describe("project content persistence", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("saves content_json only for the project owner", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Editor Project",
      slug: "editor-project",
    });

    const saved = await saveProjectContentForUser(project.id, owner.id, {
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Saved hero",
            subtitle: "Saved subtitle",
            buttonText: "Save me",
          },
        },
      ],
    });

    const loaded = await getProjectByIdForUser(project.id, owner.id);

    expect(saved).not.toBeNull();
    expect(loaded?.contentJson).toEqual({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Saved hero",
            subtitle: "Saved subtitle",
            buttonText: "Save me",
          },
        },
      ],
    });
  });

  it("returns null when a different user tries to save project content", async () => {
    const owner = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "foreign.editor@nanofactory.local",
      displayName: "Foreign Editor",
    });
    const project = await seedProject({
      userId: owner.id,
      name: "Owner Project",
      slug: "owner-project",
    });

    const saved = await saveProjectContentForUser(project.id, otherUser.id, {
      blocks: [],
    });

    expect(saved).toBeNull();
  });

  it("accepts hero imageAssetId only when the asset belongs to the same project", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Image Project",
      slug: "image-project",
    });
    const foreignProject = await seedProject({
      userId: owner.id,
      name: "Foreign Image Project",
      slug: "foreign-image-project",
    });

    const localAsset = await createAssetForProject({
      projectId: project.id,
      kind: "image",
      storageKey: `projects/${project.id}/assets/local.webp`,
      originalFilename: "local.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: null,
    });

    const foreignAsset = await createAssetForProject({
      projectId: foreignProject.id,
      kind: "image",
      storageKey: `projects/${foreignProject.id}/assets/foreign.webp`,
      originalFilename: "foreign.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: null,
    });

    await expect(
      validateHeroAssetReferencesForProject(project.id, owner.id, {
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Hero",
              subtitle: "Subtitle",
              buttonText: "CTA",
              imageAssetId: localAsset.id,
            },
          },
        ],
      })
    ).resolves.toBeUndefined();

    await expect(
      validateHeroAssetReferencesForProject(project.id, owner.id, {
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            props: {
              title: "Hero",
              subtitle: "Subtitle",
              buttonText: "CTA",
              imageAssetId: foreignAsset.id,
            },
          },
        ],
      })
    ).rejects.toThrow("Selected asset does not belong to this project.");

    await saveProjectContentForUser(project.id, owner.id, {
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Hero",
            subtitle: "Subtitle",
            buttonText: "CTA",
            imageAssetId: localAsset.id,
          },
        },
      ],
    });

    const reloadedProject = await getProjectByIdForUser(project.id, owner.id);

    expect(reloadedProject?.contentJson).toEqual({
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Hero",
            subtitle: "Subtitle",
            buttonText: "CTA",
            imageAssetId: localAsset.id,
          },
        },
      ],
    });
  });
});
