import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "../core/database/database-factory.ts";
import type { CreateTransactionInput, Transaction } from "./transaction-entity.ts";
import { transactions } from "./transactions-schema.ts";

type TransactionRepositoryOptions = {
  database: Database;
};
export type TransactionRepository = ReturnType<
  typeof transactionRepositoryFactory
>;
export const transactionRepositoryFactory = ({
  database,
}: TransactionRepositoryOptions) => ({
  findAll: async (userId: string) => {
    return database
      .select({
        id: transactions.id,
        title: transactions.title,
        amountInEuro: transactions.amountInEuro,
        timestamp: transactions.timestamp,
        categoryId: transactions.categoryId,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .all();
  },

  create: async (input: CreateTransactionInput, userId: string): Promise<Transaction> => {
    const id = randomUUID();
    database
      .insert(transactions)
      .values({ id, ...input, userId })
      .run();
    return { id, ...input };
  },

  delete: async (id: string, userId: string): Promise<void> => {
    database
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .run();
  },
});
