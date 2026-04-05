import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAssetsWithDependencies,
  postAssetRouteWithDependencies,
} from "@/app/api/projects/[projectId]/assets/route";

const mocks = {
  getServerAuthSession: vi.fn(),
  getAssetsByProjectIdForUser: vi.fn(),
  uploadAssetForProject: vi.fn(),
};

describe("assets route http handlers", () => {
  beforeEach(() => {
    mocks.getServerAuthSession.mockReset();
    mocks.getAssetsByProjectIdForUser.mockReset();
    mocks.uploadAssetForProject.mockReset();
  });

  it("returns 401 for GET when unauthenticated", async () => {
    mocks.getServerAuthSession.mockResolvedValue(null);

    const response = await getAssetsWithDependencies(
      new Request("http://localhost"),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      },
      {
        getServerAuthSession: mocks.getServerAuthSession,
        getAssetsByProjectIdForUser: mocks.getAssetsByProjectIdForUser,
      }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized." });
  });

  it("returns assets for GET when authenticated", async () => {
    mocks.getServerAuthSession.mockResolvedValue({ user: { id: "user-1" } });
    mocks.getAssetsByProjectIdForUser.mockResolvedValue([
      { id: "asset-1", projectId: "project-1" },
    ]);

    const response = await getAssetsWithDependencies(
      new Request("http://localhost"),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      },
      {
        getServerAuthSession: mocks.getServerAuthSession,
        getAssetsByProjectIdForUser: mocks.getAssetsByProjectIdForUser,
      }
    );

    expect(mocks.getAssetsByProjectIdForUser).toHaveBeenCalledWith("project-1", "user-1");
    await expect(response.json()).resolves.toEqual({
      assets: [{ id: "asset-1", projectId: "project-1" }],
    });
  });

  it("returns 401 for POST when unauthenticated", async () => {
    mocks.getServerAuthSession.mockResolvedValue(null);

    const response = await postAssetRouteWithDependencies(
      new Request("http://localhost", { method: "POST" }),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      },
      {
        getServerAuthSession: mocks.getServerAuthSession,
        uploadAssetForProject: mocks.uploadAssetForProject,
      }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized." });
  });

  it("returns 400 when file is missing", async () => {
    mocks.getServerAuthSession.mockResolvedValue({ user: { id: "user-1" } });
    const formData = new FormData();

    const response = await postAssetRouteWithDependencies(
      new Request("http://localhost", { method: "POST", body: formData }),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      },
      {
        getServerAuthSession: mocks.getServerAuthSession,
        uploadAssetForProject: mocks.uploadAssetForProject,
      }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "File is required." });
  });
});
