import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { saveProjectContentForUser, getProjectByIdForUser } from "../../lib/projects";
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
});
