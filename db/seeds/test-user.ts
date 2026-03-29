import * as dotenv from "dotenv";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { users } from "../schema";

dotenv.config({ path: ".env.local" });

const TEST_USER = {
  email: "test.user@nanofactory.local",
  displayName: "Test User",
  password: "dev-password-123",
} as const;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    const passwordHash = await hash(TEST_USER.password, 10);

    await db
      .insert(users)
      .values({
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
        passwordHash,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          displayName: TEST_USER.displayName,
          passwordHash,
        },
      });

    console.log(`Seeded test user: ${TEST_USER.email}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed test user", error);
  process.exit(1);
});
