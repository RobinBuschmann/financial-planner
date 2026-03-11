import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { SchemaRef } from "../core/database/schema-ref.ts";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
});

export const userSchemaRefFactory = (): SchemaRef => ({ users });
