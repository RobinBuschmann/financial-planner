import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export const createCategoryInputSchema = categorySchema.omit({ id: true });

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;
