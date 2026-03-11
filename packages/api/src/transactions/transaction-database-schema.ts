import { index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { SchemaRef } from "../core/database/schema-ref.ts";
import { users } from "../users/user-database-schema.ts";
import { categories } from "../categories/category-database-schema.ts";

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    amountInEuro: real("amount_in_euro").notNull(),
    timestamp: text("timestamp").notNull(),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("transactions_user_idx").on(table.userId)],
);

export const transactionSchemaRefFactory = (): SchemaRef => ({ transactions });
