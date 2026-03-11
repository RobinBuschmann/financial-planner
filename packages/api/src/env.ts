import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
expand(config({ path: path.resolve(__dirname, "../../../.env.development") }));
