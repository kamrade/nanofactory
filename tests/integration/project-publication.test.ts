import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  getProjectByIdForUser,
  getPublishedProjectBySlug,
  publishProjectForUser,
  unpublishProjectForUser,
} from "../../lib/projects";
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
});
