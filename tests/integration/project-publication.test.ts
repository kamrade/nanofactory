import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { ProjectRenderer } from "../../src/components/projects/project-renderer";
import { createAssetForProject, getAssetsByProjectId } from "../../src/lib/assets";
import { normalizePageContent } from "../../src/lib/editor/content";
import {
  getProjectByIdForUser,
  getPublishedProjectBySlug,
  publishProjectForUser,
  saveProjectContentForUser,
  unpublishProjectForUser,
} from "../../src/lib/projects";
import {
  closeTestDatabase,
  getSeededTestUser,
  resetTestDatabase,
  seedProject,
  seedUser,
} from "../helpers/db";

describe("project publication", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("publishes a project for the owner and exposes it by slug", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Public Project",
      slug: "public-project",
    });

    await publishProjectForUser(project.id, owner.id);

    const ownerView = await getProjectByIdForUser(project.id, owner.id);
    const publicView = await getPublishedProjectBySlug(project.slug);

    expect(ownerView?.status).toBe("published");
    expect(ownerView?.publishedAt).not.toBeNull();
    expect(publicView?.slug).toBe("public-project");
  });

  it("unpublishes a project and hides it from the public route", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Draft Again",
      slug: "draft-again",
      status: "published",
    });

    await publishProjectForUser(project.id, owner.id);
    await unpublishProjectForUser(project.id, owner.id);

    const ownerView = await getProjectByIdForUser(project.id, owner.id);
    const publicView = await getPublishedProjectBySlug(project.slug);

    expect(ownerView?.status).toBe("draft");
    expect(ownerView?.publishedAt).toBeNull();
    expect(publicView).toBeNull();
  });

  it("does not allow another user to publish or unpublish the project", async () => {
    const owner = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "foreign.publisher@nanofactory.local",
      displayName: "Foreign Publisher",
    });
    const project = await seedProject({
      userId: owner.id,
      name: "Owner Project",
      slug: "owner-project-publication",
    });

    const publishAttempt = await publishProjectForUser(project.id, otherUser.id);
    const unpublishAttempt = await unpublishProjectForUser(project.id, otherUser.id);

    expect(publishAttempt).toBeNull();
    expect(unpublishAttempt).toBeNull();
  });

  it("renders a published hero image only from assets scoped to the current project", async () => {
    const owner = await getSeededTestUser();
    const project = await seedProject({
      userId: owner.id,
      name: "Rendered Public Project",
      slug: "rendered-public-project",
    });

    const heroAsset = await createAssetForProject({
      projectId: project.id,
      kind: "image",
      storageKey: `projects/${project.id}/assets/public-hero.webp`,
      originalFilename: "public-hero.webp",
      mimeType: "image/webp",
      sizeBytes: 1024,
      width: null,
      height: null,
      alt: "Published hero image",
    });

    await saveProjectContentForUser(project.id, owner.id, {
      blocks: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Public Hero Title",
            subtitle: "Public hero subtitle",
            buttonText: "Explore",
            imageAssetId: heroAsset.id,
          },
        },
      ],
    });

    await publishProjectForUser(project.id, owner.id);

    const publicProject = await getPublishedProjectBySlug(project.slug);
    const publicAssets = await getAssetsByProjectId(project.id);

    const html = renderToStaticMarkup(
      ProjectRenderer({
        name: publicProject!.name,
        themeKey: publicProject!.themeKey,
        content: normalizePageContent(publicProject!.contentJson),
        assets: publicAssets,
      })
    );

    expect(publicProject).not.toBeNull();
    expect(publicAssets).toHaveLength(1);
    expect(html).toContain(heroAsset.publicUrl);
    expect(html).toContain('alt="Published hero image"');
    expect(html).toContain("Public Hero Title");
  });
});
