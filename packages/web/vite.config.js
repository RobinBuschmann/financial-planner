import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "url";
import path from "path";

const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default {
  root: "src",
  envDir: monorepoRoot,
  test: {
    environment: "jsdom",
    setupFiles: ["./src/testSetup.ts"],
    isolate: false,
    maxWorkers: 1,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        "src/common/components",
      ),
      "@/lib/utils": path.resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        "src/common/utils/cn.ts",
      ),
      "@": path.resolve(fileURLToPath(new URL(".", import.meta.url)), "src"),
    },
  },
  plugins: [
    tanstackRouter({
      routesDirectory: "./routes",
      generatedRouteTree: "./routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
  ],
};
