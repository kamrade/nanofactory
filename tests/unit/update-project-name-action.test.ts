import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateProjectNameActionWithDependencies } from "@/app/(protected)/projects/[projectId]/actions";

const mocks = {
  requireCurrentUser: vi.fn(),
  updateProjectNameForUser: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
};

const dependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  updateProjectNameForUser: mocks.updateProjectNameForUser,
  revalidatePath: mocks.revalidatePath,
  redirect: mocks.redirect,
};

describe("updateProjectNameActionWithDependencies", () => {
  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.updateProjectNameForUser.mockReset();
    mocks.revalidatePath.mockClear();
    mocks.redirect.mockClear();
  });

  it("updates name, revalidates paths, and redirects on valid input", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.updateProjectNameForUser.mockResolvedValue({
      id: "project-1",
      slug: "my-project",
      name: "Renamed project",
    });

    const formData = new FormData();
    formData.set("name", "Renamed project");
    formData.set("slug", "renamed-project");

    await expect(
      updateProjectNameActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectNameForUser).toHaveBeenCalledWith(
      "project-1",
      "user-1",
      "Renamed project",
      "renamed-project"
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/projects/project-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/p/my-project");
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });

  it("rejects empty name and redirects back without update", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });

    const formData = new FormData();
    formData.set("name", "   ");
    formData.set("slug", "any-slug");

    await expect(
      updateProjectNameActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectNameForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});
