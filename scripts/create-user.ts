import * as dotenv from "dotenv";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

import { users } from "../db/schema";

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env", quiet: true });

type CliArgs = {
  email: string;
  password: string;
  displayName: string | null;
};

function printUsage() {
  console.log(
    [
      "Create a user in the database.",
      "",
      "Usage:",
      "  npm run user:create -- --email user@example.com --password 'StrongPass123!' [--name 'User Name']",
      "",
      "Flags:",
      "  --email      Required user email",
      "  --password   Required plain password (will be hashed with bcrypt)",
      "  --name       Optional display name",
      "  --help       Show this help",
      "",
      "Optional env:",
      "  DOTENV_CONFIG_PATH=.env.local",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): CliArgs {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const getValue = (flag: string) => {
    const idx = argv.indexOf(flag);
    if (idx === -1) {
      return null;
    }

    return argv[idx + 1] ?? null;
  };

  const email = getValue("--email")?.trim() ?? "";
  const password = getValue("--password") ?? "";
  const displayNameRaw = getValue("--name");
  const displayName = displayNameRaw?.trim() ? displayNameRaw.trim() : null;

  if (!email) {
    throw new Error("Missing required --email");
  }

  if (!password) {
    throw new Error("Missing required --password");
  }

  return {
    email,
    password,
    displayName,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, args.email))
      .limit(1);

    if (existingUser) {
      throw new Error(`User with email "${args.email}" already exists`);
    }

    const passwordHash = await hash(args.password, 10);

    const [createdUser] = await db
      .insert(users)
      .values({
        email: args.email,
        passwordHash,
        displayName: args.displayName,
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    console.log(`Created user ${createdUser.email} (${createdUser.id})`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(
    error instanceof Error ? `Failed to create user: ${error.message}` : "Failed to create user"
  );
  process.exit(1);
});
