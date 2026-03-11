import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { SchemaRef } from "../database/schema-ref.js";

export const inmemoryDatabaseFactory = () => {
  const client = new Database(":memory:");
  const db = drizzle({ client });
  migrate(db, {
    migrationsFolder: join(import.meta.dirname, "../../../drizzle"),
  });
  client.pragma("foreign_keys = OFF");
  return db as unknown as BetterSQLite3Database<SchemaRef> & {
    $client: Database.Database;
  };
};
