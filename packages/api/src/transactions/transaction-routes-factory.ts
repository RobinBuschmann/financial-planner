import { z } from "zod";
import { Route } from "../core/routes/route.ts";
import { TransactionService } from "./transaction-service-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";
import {
  transactionSchema,
  createTransactionInputSchema,
} from "./transaction-entity.ts";

export type TransactionRoutesOptions = {
  transactionService: TransactionService;
  verifyUserId: VerifyUserId;
};
export const transactionRoutesFactory = ({
  transactionService,
  verifyUserId,
}: TransactionRoutesOptions): Route => ({
  path: "/transactions",
  async apply(fastify) {
    fastify.get(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          response: {
            200: z.array(transactionSchema),
          },
        },
      },
      (request) => transactionService.getAll(request.userId),
    );

    fastify.post(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          body: createTransactionInputSchema,
          response: {
            201: transactionSchema,
          },
        },
      },
      async (request, reply) => {
        const transaction = await transactionService.create(
          request.body,
          request.userId,
        );
        reply
          .status(201)
          .header("Location", `/transactions/${transaction.id}`)
          .send(transaction);
      },
    );

    fastify.delete(
      "/:id",
      {
        onRequest: [verifyUserId],
        schema: {
          params: z.object({ id: z.string() }),
          response: { 204: z.undefined() },
        },
      },
      async (request, reply) => {
        await transactionService.delete(request.params.id, request.userId);
        reply.status(204).send();
      },
    );
  },
});
