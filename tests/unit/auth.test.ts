import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  compare: vi.fn(),
}));

vi.mock("next-auth", () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock("bcryptjs", () => ({
  compare: mocks.compare,
}));

import { authOptions, authorizeCredentials } from "@/auth";
import { db } from "@/db";
import { TEST_USER } from "../../db/seeds/test-data";

describe("authOptions credentials authorize", () => {
  let dbSelectSpy: ReturnType<typeof vi.spyOn> | null = null;
  let fromMock: ReturnType<typeof vi.fn>;
  let whereMock: ReturnType<typeof vi.fn>;
  let limitMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    if (dbSelectSpy) {
      dbSelectSpy.mockRestore();
    }

    mocks.getServerSession.mockReset();
    mocks.compare.mockReset();

    fromMock = vi.fn();
    whereMock = vi.fn();
    limitMock = vi.fn();

    dbSelectSpy = vi.spyOn(db, "select").mockImplementation(() => ({ from: fromMock }));
    fromMock.mockImplementation(() => ({ where: whereMock }));
    whereMock.mockImplementation(() => ({ limit: limitMock }));
  });

  it("returns null for empty credentials", async () => {
    expect(await authorizeCredentials(undefined)).toBeNull();
    expect(await authorizeCredentials({ email: "", password: "" })).toBeNull();
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns null for unknown user", async () => {
    limitMock.mockResolvedValue([]);

    const result = await authorizeCredentials({
      email: "missing.user@nanofactory.local",
      password: "dev-password-123",
    });

    expect(result).toBeNull();
  });

  it("returns null for invalid password", async () => {
    limitMock.mockResolvedValue([
      {
        id: TEST_USER.id,
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
        passwordHash: "hash",
      },
    ]);
    mocks.compare.mockResolvedValue(false);

    const result = await authorizeCredentials({
      email: TEST_USER.email,
      password: "wrong-password",
    });

    expect(result).toBeNull();
  });

  it("returns user for valid credentials", async () => {
    limitMock.mockResolvedValue([
      {
        id: TEST_USER.id,
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
        passwordHash: "hash",
      },
    ]);
    mocks.compare.mockResolvedValue(true);

    const result = await authorizeCredentials({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    expect(result).toEqual({
      id: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.displayName,
    });
  });
});

describe("authOptions callbacks", () => {
  it("stores token.id when user is present", async () => {
    const jwt = authOptions.callbacks?.jwt;

    if (!jwt) {
      throw new Error("authOptions.callbacks.jwt not configured");
    }

    const token = await jwt({
      token: {},
      user: { id: "user-1" },
    } as { token: Record<string, unknown>; user?: { id?: string } });

    expect(token).toEqual({ id: "user-1" });
  });

  it("stores session.user.id from token", async () => {
    const sessionCallback = authOptions.callbacks?.session;

    if (!sessionCallback) {
      throw new Error("authOptions.callbacks.session not configured");
    }

    const session = await sessionCallback({
      session: { user: {} },
      token: { id: "user-2" },
    } as {
      session: { user?: Record<string, unknown> };
      token: { id?: string };
    });

    expect(session.user?.id).toBe("user-2");
  });
});
