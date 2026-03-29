import * as dotenv from "dotenv";
import { spawnSync } from "node:child_process";
import { Client } from "pg";

const TEST_ENV_PATH = ".env.test";

export function loadTestEnv() {
  dotenv.config({ path: TEST_ENV_PATH });

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
