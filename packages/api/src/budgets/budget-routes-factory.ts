import { z } from "zod";
import { Route } from "../core/routes/route.ts";
import type { BudgetService } from "./budget-service-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";
import { budgetSchema, createBudgetInputSchema } from "./budget-entity.ts";

export type BudgetRoutesOptions = {
  budgetService: BudgetService;
  verifyUserId: VerifyUserId;
};
export const budgetRoutesFactory = ({
  budgetService,
  verifyUserId,
}: BudgetRoutesOptions): Route => ({
  path: "/budgets",
  async apply(fastify) {
    fastify.get(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          response: {
            200: z.array(budgetSchema),
          },
        },
      },
      (request) => budgetService.getAll(request.userId),
    );

    fastify.post(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          body: createBudgetInputSchema,
          response: {
            201: budgetSchema,
          },
        },
      },
      async (request, reply) => {
        const budget = await budgetService.create(request.body, request.userId);
        reply.status(201).header("Location", `/budgets/${budget.id}`);
        return budget;
      },
    );

    fastify.delete(
      "/:id",
      {
        onRequest: [verifyUserId],
        schema: { params: z.object({ id: z.string() }), response: { 204: z.undefined() } },
      },
      async (request, reply) => {
        await budgetService.delete(request.params.id, request.userId);
        reply.status(204).send();
      },
    );
  },
});
