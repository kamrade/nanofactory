import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": ".",
      "server-only": "./tests/helpers/server-only.ts",
    },
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/helpers/setup-env.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
