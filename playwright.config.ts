import * as dotenv from "dotenv";
import { defineConfig } from "@playwright/test";

dotenv.config({ path: ".env.test" });

const testServerEnv = [
  `DATABASE_URL=${process.env.DATABASE_URL}`,
  `AUTH_SECRET=${process.env.AUTH_SECRET}`,
  `NEXTAUTH_URL=${process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3011"}`,
].join(" ");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3011",
    headless: true,
  },
  webServer: {
    command: `${testServerEnv} npx next build && ${testServerEnv} npx next start -p 3011`,
    url: "http://127.0.0.1:3011",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
