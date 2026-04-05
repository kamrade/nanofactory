import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  publishProjectActionWithDependencies,
  unpublishProjectActionWithDependencies,
} from "@/app/(protected)/projects/[projectId]/actions";

const mocks = {
  requireCurrentUser: vi.fn(),
  publishProjectForUser: vi.fn(),
  unpublishProjectForUser: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
};

const publishDependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  publishProjectForUser: mocks.publishProjectForUser,
  revalidatePath: mocks.revalidatePath,
  redirect: mocks.redirect,
};

const unpublishDependencies = {
  requireCurrentUser: mocks.requireCurrentUser,
  unpublishProjectForUser: mocks.unpublishProjectForUser,
  revalidatePath: mocks.revalidatePath,
  redirect: mocks.redirect,
};

describe("publishProjectActionWithDependencies", () => {

  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.publishProjectForUser.mockReset();
    mocks.revalidatePath.mockClear();
    mocks.redirect.mockClear();
  });

  it("redirects to dashboard when project is missing", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.publishProjectForUser.mockResolvedValue(null);

    await expect(
      publishProjectActionWithDependencies("project-1", publishDependencies)
    ).rejects.toThrow("redirected");
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("revalidates paths and redirects on success", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.publishProjectForUser.mockResolvedValue({
      id: "project-1",
      slug: "my-project",
    });

    await expect(
      publishProjectActionWithDependencies("project-1", publishDependencies)
    ).rejects.toThrow("redirected");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/projects/project-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/p/my-project");
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});

describe("unpublishProjectActionWithDependencies", () => {

  beforeEach(() => {
    mocks.requireCurrentUser.mockReset();
    mocks.unpublishProjectForUser.mockReset();
    mocks.revalidatePath.mockClear();
    mocks.redirect.mockClear();
  });

  it("redirects to dashboard when project is missing", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.unpublishProjectForUser.mockResolvedValue(null);

    await expect(
      unpublishProjectActionWithDependencies("project-1", unpublishDependencies)
    ).rejects.toThrow("redirected");
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("revalidates paths and redirects on success", async () => {
    mocks.requireCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.unpublishProjectForUser.mockResolvedValue({
      id: "project-1",
      slug: "my-project",
    });

    await expect(
      unpublishProjectActionWithDependencies("project-1", unpublishDependencies)
    ).rejects.toThrow("redirected");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/projects/project-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/p/my-project");
    expect(mocks.redirect).toHaveBeenCalledWith("/projects/project-1");
  });
});
