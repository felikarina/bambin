import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "../vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      include: ["src/**/*.spec.ts", "src/**/*.test.ts"],
      root: fileURLToPath(new URL("../", import.meta.url)),
      coverage: {
        all: true,
        reporter: ["text", "html"],
        reportsDirectory: "coverage",
        include: ["src/**/*"],
        exclude: [
          "src/components/icons/**",
          "**/*.spec.ts",
          "**/*.test.ts",
          "src/main.ts",
          "src/env.d.ts",
        ],
      },
    },
  })
);
