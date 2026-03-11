import { defineConfig } from "drizzle-kit";
import { globSync } from "glob";
import { join } from "path";

export default defineConfig({
  dialect: "sqlite",
  schema: globSync(join(__dirname, "src", "**", "*-schema.ts")),
  dbCredentials: {
    url: join(__dirname, "financial-planner.db"),
  },
});
