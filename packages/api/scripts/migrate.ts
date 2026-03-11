import "../src/env.ts";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const client = new Database("./financial-planner.db");
const db = drizzle({ client });

migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied.");
client.close();
