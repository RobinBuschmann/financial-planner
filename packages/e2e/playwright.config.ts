import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
expand(config({ path: path.resolve(__dirname, "../../.env.development") }));

const apiPort = Number(process.env.API_PORT) || 3000;
const webPort = Number(process.env.WEB_PORT) || 3001;

// CWD when running via `npm run test -w @financial-planner/e2e` is packages/e2e/
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: `http://localhost:${webPort}`,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      // npm --prefix sets the working directory for the script to packages/api/
      command: "npm --prefix ../api run start",
      port: apiPort,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm --prefix ../web run dev",
      port: webPort,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
