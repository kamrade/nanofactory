import * as dotenv from "dotenv";
import { spawnSync } from "node:child_process";
import { hash } from "bcryptjs";
import { Client } from "pg";

import { TEST_USER } from "../db/seeds/test-data";

const TEST_ENV_PATH = ".env.test";

export function loadTestEnv() {
  dotenv.config({ path: TEST_ENV_PATH, quiet: true });

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.test");
  }

  return process.env.DATABASE_URL;
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function getTestDatabaseName(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const databaseName = url.pathname.replace(/^\//, "");

  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name");
  }

  return databaseName;
}

function getAdminDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  url.pathname = "/postgres";
  return url.toString();
}

function runCommand(command: string, args: string[], extraEnv: Record<string, string>) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

export async function ensureTestDatabaseExists() {
  const databaseUrl = loadTestEnv();
  const databaseName = getTestDatabaseName(databaseUrl);
  const adminClient = new Client({
    connectionString: getAdminDatabaseUrl(databaseUrl),
  });

  await adminClient.connect();

  try {
    const result = await adminClient.query(
      "select 1 from pg_database where datname = $1",
      [databaseName]
    );

    if (result.rowCount === 0) {
      await adminClient.query(`create database ${quoteIdentifier(databaseName)}`);
    }
  } finally {
    await adminClient.end();
  }
}

export function syncTestDatabaseSchema() {
  runCommand("npx", ["drizzle-kit", "push", "--force"], {
    DATABASE_URL: loadTestEnv(),
  });
}

export async function resetTestDatabase() {
  const client = new Client({
    connectionString: loadTestEnv(),
  });

  await client.connect();

  try {
    await client.query(
      'TRUNCATE TABLE "assets", "project_contents", "projects", "users" RESTART IDENTITY CASCADE'
    );
  } finally {
    await client.end();
  }
}

export function seedTestUser() {
  runCommand("npx", ["tsx", "db/seeds/test-user.ts"], {
    DATABASE_URL: loadTestEnv(),
    DOTENV_CONFIG_PATH: TEST_ENV_PATH,
  });
}

export async function seedUser(input: {
  email: string;
  displayName: string;
  password?: string;
}) {
  const client = new Client({
    connectionString: loadTestEnv(),
  });

  await client.connect();

  try {
    const passwordHash = await hash(input.password ?? TEST_USER.password, 10);
    const result = await client.query(
      `insert into "users" ("email", "password_hash", "display_name")
       values ($1, $2, $3)
       returning "id", "email", "display_name"`,
      [input.email, passwordHash, input.displayName]
    );

    return result.rows[0] as {
      id: string;
      email: string;
      display_name: string;
    };
  } finally {
    await client.end();
  }
}

export async function seedProject(input: {
  userId: string;
  name: string;
  slug: string;
  status?: "draft" | "published";
  themeKey?: string;
}) {
  const client = new Client({
    connectionString: loadTestEnv(),
  });

  await client.connect();

  try {
    await client.query("begin");

    const projectResult = await client.query(
      `insert into "projects" ("user_id", "name", "slug", "theme_key", "status")
       values ($1, $2, $3, $4, $5)
       returning "id", "name", "slug", "status", "user_id"`,
      [
        input.userId,
        input.name,
        input.slug,
        input.themeKey ?? "classic-light",
        input.status ?? "draft",
      ]
    );

    await client.query(
      `insert into "project_contents" ("project_id", "content_json", "schema_version")
       values ($1, $2::jsonb, $3)`,
      [projectResult.rows[0].id, JSON.stringify({ blocks: [] }), 1]
    );

    await client.query("commit");

    return projectResult.rows[0] as {
      id: string;
      name: string;
      slug: string;
      status: "draft" | "published";
      user_id: string;
    };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}
