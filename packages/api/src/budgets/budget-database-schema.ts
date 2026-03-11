import { index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { SchemaRef } from "../core/database/schema-ref.ts";
import { users } from "../users/user-database-schema.ts";
import { categories } from "../categories/category-database-schema.ts";

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    limitInEuro: real("limit_in_euro").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("budgets_user_idx").on(table.userId)],
);

export const budgetSchemaRefFactory = (): SchemaRef => ({ budgets });
