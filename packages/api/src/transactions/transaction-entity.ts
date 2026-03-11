import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  amountInEuro: z.number(),
  timestamp: z.string(),
  categoryId: z.string().nullable(),
});

export const createTransactionInputSchema = transactionSchema.omit({ id: true });

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;
