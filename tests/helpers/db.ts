import { hash } from "bcryptjs";
import { eq, sql } from "drizzle-orm";

import { closeDbConnection, db } from "../../db/index";
import { projectContents, projects, users } from "../../db/schema";
import { TEST_USER } from "../../db/seeds/test-data";

export async function resetTestDatabase() {
  await db.execute(
    sql.raw(
      'TRUNCATE TABLE "assets", "project_contents", "projects", "users" RESTART IDENTITY CASCADE'
    )
  );

  await seedTestUser();
}

export async function seedTestUser() {
  const passwordHash = await hash(TEST_USER.password, 10);

  const [user] = await db
    .insert(users)
    .values({
      id: TEST_USER.id,
      email: TEST_USER.email,
      displayName: TEST_USER.displayName,
      passwordHash,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        id: TEST_USER.id,
        displayName: TEST_USER.displayName,
        passwordHash,
      },
    })
    .returning({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    });

  return user;
}

export async function getSeededTestUser() {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    })
    .from(users)
    .where(eq(users.email, TEST_USER.email))
    .limit(1);

  if (!user) {
    throw new Error("Seeded test user was not found");
  }

  return user;
}

export async function seedUser(input: {
  email: string;
  displayName: string;
  passwordHash?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      displayName: input.displayName,
      passwordHash: input.passwordHash ?? "test-password-hash",
    })
    .returning({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    });

  return user;
}

export async function seedProject(input: {
  userId: string;
  name: string;
  slug: string;
  status?: "draft" | "published";
  themeKey?: string;
}) {
  const [project] = await db
    .insert(projects)
    .values({
      userId: input.userId,
      name: input.name,
      slug: input.slug,
      themeKey: input.themeKey ?? "classic-light",
      status: input.status ?? "draft",
    })
    .returning({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      status: projects.status,
      userId: projects.userId,
    });

  await db.insert(projectContents).values({
    projectId: project.id,
    contentJson: { blocks: [] },
    schemaVersion: 1,
  });

  return project;
}

export async function closeTestDatabase() {
  await closeDbConnection();
}
