import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirected");
  }),
}));

vi.mock("next-auth", () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { db } from "@/db";
import { getCurrentUser, requireCurrentUser } from "@/lib/auth/current-user";
import { TEST_USER } from "../../db/seeds/test-data";

describe("current user helpers", () => {
  let dbSelectSpy: ReturnType<typeof vi.spyOn> | null = null;
  let fromMock: ReturnType<typeof vi.fn>;
  let whereMock: ReturnType<typeof vi.fn>;
  let limitMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    if (dbSelectSpy) {
      dbSelectSpy.mockRestore();
    }

    mocks.getServerSession.mockReset();
    mocks.redirect.mockClear();

    fromMock = vi.fn();
    whereMock = vi.fn();
    limitMock = vi.fn();

    dbSelectSpy = vi.spyOn(db, "select").mockImplementation(() => ({ from: fromMock }));
    fromMock.mockImplementation(() => ({ where: whereMock }));
    whereMock.mockImplementation(() => ({ limit: limitMock }));
  });

  it("returns null when session is missing user id", async () => {
    mocks.getServerSession.mockResolvedValue(null);

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns the current user when session has a user id", async () => {
    mocks.getServerSession.mockResolvedValue({
      user: { id: TEST_USER.id },
    });
    limitMock.mockResolvedValue([
      {
        id: TEST_USER.id,
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-02T00:00:00.000Z"),
      },
    ]);

    const user = await getCurrentUser();

    expect(user).toEqual({
      id: TEST_USER.id,
      email: TEST_USER.email,
      displayName: TEST_USER.displayName,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    });
  });

  it("redirects to /login when current user is missing", async () => {
    mocks.getServerSession.mockResolvedValue(null);

    await expect(requireCurrentUser()).rejects.toThrow("redirected");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("returns user when current user exists", async () => {
    mocks.getServerSession.mockResolvedValue({
      user: { id: TEST_USER.id },
    });
    limitMock.mockResolvedValue([
      {
        id: TEST_USER.id,
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-02T00:00:00.000Z"),
      },
    ]);

    await expect(requireCurrentUser()).resolves.toMatchObject({
      id: TEST_USER.id,
      email: TEST_USER.email,
    });
  });
});
