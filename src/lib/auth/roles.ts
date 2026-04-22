import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserRole = "user" | "admin";

export class RoleGuardError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "RoleGuardError";
    this.status = status;
  }
}

export async function getUserRoleById(userId: string): Promise<UserRole | null> {
  const [user] = await db
    .select({
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.role ?? null;
}

export async function requireAdminByUserId(userId: string) {
  const role = await getUserRoleById(userId);

  if (role !== "admin") {
    throw new RoleGuardError("Forbidden.", 403);
  }
}
