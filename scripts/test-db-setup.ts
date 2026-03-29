import {
  ensureTestDatabaseExists,
  resetTestDatabase,
  seedTestUser,
  syncTestDatabaseSchema,
} from "./test-db-utils";

async function main() {
  await ensureTestDatabaseExists();
  syncTestDatabaseSchema();
  await resetTestDatabase();
  seedTestUser();
}

main().catch((error) => {
  console.error("Failed to set up test database", error);
  process.exit(1);
});
