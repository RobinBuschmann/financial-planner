import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { SchemaRef } from "../core/database/schema-ref.ts";
import { users } from "../users/users-schema.ts";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
}, (table) => [
  index("categories_user_idx").on(table.userId),
]);

export const categorySchemaRefFactory = (): SchemaRef => ({ categories });
