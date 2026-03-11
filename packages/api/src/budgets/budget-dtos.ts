import { z } from "zod";

export const budgetSchema = z.object({
  id: z.string(),
  categoryId: z.string().min(1),
  limitInEuro: z.number(),
});

export const createBudgetInputSchema = budgetSchema.omit({ id: true });

export type Budget = z.infer<typeof budgetSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetInputSchema>;
