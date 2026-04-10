import { beforeEach, describe, expect, it, vi } from "vitest";

import { createProjectActionWithDependencies } from "@/app/(protected)/dashboard/actions";
import { DEFAULT_THEME_KEY } from "@/lib/themes";

const mocks = {
  requireCurrentUser: vi.fn(),
  createProjectForUser: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
};

const dependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  createProjectForUser: mocks.createProjectForUser,
  redirect: mocks.redirect,
};

describe("createProjectActionWithDependencies", () => {

  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.createProjectForUser.mockReset();
    mocks.redirect.mockClear();
  });

  it("throws when name is empty", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });

    const formData = new FormData();
    formData.set("name", "   ");

    await expect(
      createProjectActionWithDependencies(formData, dependencies)
    ).rejects.toThrow("Project name is required");
  });

  it("trims name and redirects to created project", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.createProjectForUser.mockResolvedValue({ id: "project-1" });

    const formData = new FormData();
    formData.set("name", "  My Project  ");

    await expect(
      createProjectActionWithDependencies(formData, dependencies)
    ).rejects.toThrow("redirected");
    expect(mocks.createProjectForUser).toHaveBeenCalledWith("user-1", {
      name: "My Project",
      themeKey: DEFAULT_THEME_KEY,
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});
