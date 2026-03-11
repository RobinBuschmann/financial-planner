import "../src/env.ts";
import { writeFileSync } from "fs";
import { createApp } from "../src/app.ts";

const app = await createApp();
await app.ready();
writeFileSync("./openapi.json", JSON.stringify(app.swagger(), null, 2));
await app.close();
