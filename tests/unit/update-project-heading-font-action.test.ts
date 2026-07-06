import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateProjectHeadingFontActionWithDependencies } from "@/app/(protected)/projects/[projectId]/actions";

const mocks = {
  requireCurrentUser: vi.fn(),
  updateProjectHeadingFontForUser: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
};

const dependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  updateProjectHeadingFontForUser: mocks.updateProjectHeadingFontForUser,
  revalidatePath: mocks.revalidatePath,
  redirect: mocks.redirect,
};

describe("updateProjectHeadingFontActionWithDependencies", () => {
  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.updateProjectHeadingFontForUser.mockReset();
    mocks.revalidatePath.mockClear();
    mocks.redirect.mockClear();
  });

  it("updates heading font, revalidates paths, and redirects on valid input", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.updateProjectHeadingFontForUser.mockResolvedValue({
      id: "project-1",
      slug: "my-project",
    });

    const formData = new FormData();
    formData.set("headingFont", "playfair-display");

    await expect(
      updateProjectHeadingFontActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectHeadingFontForUser).toHaveBeenCalledWith(
      "project-1",
      "user-1",
      "playfair-display"
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/projects/project-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/p/my-project");
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });

  it("rejects invalid input and redirects back without update", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });

    const formData = new FormData();
    formData.set("headingFont", "geist");

    await expect(
      updateProjectHeadingFontActionWithDependencies("project-1", formData, dependencies)
    ).rejects.toThrow("redirected");

    expect(mocks.updateProjectHeadingFontForUser).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});
