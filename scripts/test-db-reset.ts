import { resetTestDatabase, seedTestUser } from "./test-db-utils";

async function main() {
  await resetTestDatabase();
  seedTestUser();
}

main().catch((error) => {
  console.error("Failed to reset test database", error);
  process.exit(1);
});
