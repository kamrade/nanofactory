import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createProjectForUser,
  getProjectByIdForUser,
  getProjectsByUserId,
} from "../../lib/projects";
import {
  closeTestDatabase,
  getSeededTestUser,
  resetTestDatabase,
  seedProject,
  seedUser,
} from "../helpers/db";

describe("project queries", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("returns only projects owned by the current user", async () => {
    const testUser = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "other.user@nanofactory.local",
      displayName: "Other User",
    });

    await seedProject({
      userId: testUser.id,
      name: "Project One",
      slug: "project-one",
    });
    await seedProject({
      userId: otherUser.id,
      name: "Other Project",
      slug: "other-project",
    });

    const userProjects = await getProjectsByUserId(testUser.id);

    expect(userProjects).toHaveLength(1);
    expect(userProjects[0]?.name).toBe("Project One");
  });

  it("creates a project and matching project_contents in one flow", async () => {
    const testUser = await getSeededTestUser();

    const project = await createProjectForUser(testUser.id, {
      name: "My New Project",
    });
    const loadedProject = await getProjectByIdForUser(project.id, testUser.id);

    expect(project.slug).toBe("my-new-project");
    expect(loadedProject).not.toBeNull();
    expect(loadedProject?.contentJson).toEqual({ blocks: [] });
    expect(loadedProject?.schemaVersion).toBe(1);
  });

  it("creates predictable unique slugs for duplicate names", async () => {
    const testUser = await getSeededTestUser();

    const firstProject = await createProjectForUser(testUser.id, {
      name: "My Project",
    });
    const secondProject = await createProjectForUser(testUser.id, {
      name: "My Project",
    });

    expect(firstProject.slug).toBe("my-project");
    expect(secondProject.slug).toBe("my-project-2");
  });

  it("returns null for foreign or invalid project access", async () => {
    const testUser = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "other.user@nanofactory.local",
      displayName: "Other User",
    });
    const otherProject = await seedProject({
      userId: otherUser.id,
      name: "Other Project",
      slug: "other-project",
    });

    const foreignProject = await getProjectByIdForUser(otherProject.id, testUser.id);
    const invalidProject = await getProjectByIdForUser("not-a-uuid", testUser.id);

    expect(foreignProject).toBeNull();
    expect(invalidProject).toBeNull();
  });
});
