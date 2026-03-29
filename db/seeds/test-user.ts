import * as dotenv from "dotenv";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { users } from "../schema";
import { TEST_USER } from "./test-data";

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env.local", quiet: true });

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
        id: TEST_USER.id,
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

    if (process.env.DOTENV_CONFIG_PATH !== ".env.test") {
      console.log(`Seeded test user: ${TEST_USER.email}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to seed test user", error);
  process.exit(1);
});
