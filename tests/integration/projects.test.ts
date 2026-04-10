import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createProjectForUser,
  getProjectByIdForUser,
  getProjectsByUserId,
  updateProjectThemeForUser,
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

  it("updates theme when project is owned by current user", async () => {
    const testUser = await getSeededTestUser();
    const project = await seedProject({
      userId: testUser.id,
      name: "Themed Project",
      slug: "themed-project",
      themeKey: "sunwash",
    });

    const updatedProject = await updateProjectThemeForUser(
      project.id,
      testUser.id,
      "nightfall"
    );
    const loadedProject = await getProjectByIdForUser(project.id, testUser.id);

    expect(updatedProject).not.toBeNull();
    expect(updatedProject?.themeKey).toBe("nightfall");
    expect(loadedProject?.themeKey).toBe("nightfall");
  });

  it("does not update theme for foreign project owner", async () => {
    const testUser = await getSeededTestUser();
    const otherUser = await seedUser({
      email: "theme.owner@nanofactory.local",
      displayName: "Theme Owner",
    });
    const otherProject = await seedProject({
      userId: otherUser.id,
      name: "Other User Project",
      slug: "other-user-project",
      themeKey: "sunwash",
    });

    const result = await updateProjectThemeForUser(
      otherProject.id,
      testUser.id,
      "nightfall"
    );
    const unchangedProject = await getProjectByIdForUser(otherProject.id, otherUser.id);

    expect(result).toBeNull();
    expect(unchangedProject?.themeKey).toBe("sunwash");
  });

  it("returns null when project id is invalid", async () => {
    const testUser = await getSeededTestUser();

    const result = await updateProjectThemeForUser("invalid-id", testUser.id, "nightfall");

    expect(result).toBeNull();
  });
});
