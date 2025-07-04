import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "../vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      include: ["frontend/src/**/*.spec.ts", "frontend/src/**/*.test.ts"],
      root: fileURLToPath(new URL("../", import.meta.url)),
      coverage: {
        all: true,
        reporter: ["text", "html"],
        reportsDirectory: "coverage",
        include: ["frontend/src/**/*"],
        exclude: [
          "frontend/src/components/icons/**",
          "**/*.spec.ts",
          "**/*.test.ts",
          "frontend/src/main.ts",
          "src/env.d.ts",
        ],
      },
    },
  })
);
