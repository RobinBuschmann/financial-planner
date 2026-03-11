import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "../core/database/database-factory.ts";
import type { Category, CreateCategoryInput } from "./category-entity.ts";
import { categories } from "./categories-schema.ts";

type CategoryRepositoryOptions = {
  database: Database;
};
export type CategoryRepository = ReturnType<typeof categoryRepositoryFactory>;
export const categoryRepositoryFactory = ({
  database,
}: CategoryRepositoryOptions) => ({
  findAll: async (userId: string): Promise<Category[]> => {
    return database
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.userId, userId))
      .all();
  },

  create: async (input: CreateCategoryInput, userId: string): Promise<Category> => {
    const id = randomUUID();
    database.insert(categories).values({ id, ...input, userId }).run();
    return { id, ...input };
  },

  delete: async (id: string, userId: string): Promise<void> => {
    database
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .run();
  },
});
