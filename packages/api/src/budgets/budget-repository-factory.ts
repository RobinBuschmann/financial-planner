import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "../core/database/database-factory.ts";
import type { Budget, CreateBudgetInput } from "./budget-entity.ts";
import { budgets } from "./budgets-schema.ts";

type BudgetRepositoryOptions = {
  database: Database;
};
export type BudgetRepository = ReturnType<typeof budgetRepositoryFactory>;
export const budgetRepositoryFactory = ({
  database,
}: BudgetRepositoryOptions) => ({
  findAll: async (userId: string): Promise<Budget[]> => {
    return database
      .select({
        id: budgets.id,
        categoryId: budgets.categoryId,
        limitInEuro: budgets.limitInEuro,
      })
      .from(budgets)
      .where(eq(budgets.userId, userId))
      .all();
  },

  create: async (input: CreateBudgetInput, userId: string): Promise<Budget> => {
    const id = randomUUID();
    database.insert(budgets).values({ id, ...input, userId }).run();
    return { id, ...input };
  },

  delete: async (id: string, userId: string): Promise<void> => {
    database
      .delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .run();
  },
});
