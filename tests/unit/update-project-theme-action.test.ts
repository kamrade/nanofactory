import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateProjectThemeActionWithDependencies } from "@/app/(protected)/projects/[projectId]/actions";

const mocks = {
  requireCurrentUser: vi.fn(),
  updateProjectThemeForUser: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
};

const dependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  updateProjectThemeForUser: mocks.updateProjectThemeForUser,
  revalidatePath: mocks.revalidatePath,
  redirect: mocks.redirect,
};

describe("updateProjectThemeActionWithDependencies", () => {
  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.updateProjectThemeForUser.mockReset();
    mocks.revalidatePath.mockClear();
    mocks.redirect.mockClear();
  });

  it("updates theme, revalidates paths, and redirects on valid theme", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.updateProjectThemeForUser.mockResolvedValue({
      id: "project-1",
      slug: "my-project",
    });

    const formData = new FormData();
    formData.set("themeKey", "nightfall");

    await expect(
      updateProjectThemeActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectThemeForUser).toHaveBeenCalledWith(
      "project-1",
      "user-1",
      "nightfall"
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/projects/project-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/p/my-project");
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });

  it("rejects invalid theme and redirects back without update", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });

    const formData = new FormData();
    formData.set("themeKey", "unknown-theme");

    await expect(
      updateProjectThemeActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectThemeForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});
