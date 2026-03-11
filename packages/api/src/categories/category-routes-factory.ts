import { z } from "zod";
import { Route } from "../core/routes/route.ts";
import type { CategoryService } from "./category-service-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";
import { categorySchema, createCategoryInputSchema } from "./category-dtos.ts";
import { CategoryAlreadyExistsError } from "./category-already-exists-error.ts";

export type CategoryRoutesOptions = {
  categoryService: CategoryService;
  verifyUserId: VerifyUserId;
};
export const categoryRoutesFactory = ({
  categoryService,
  verifyUserId,
}: CategoryRoutesOptions): Route => ({
  path: "/categories",
  async apply(fastify) {
    fastify.get(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          response: {
            200: z.array(categorySchema),
          },
        },
      },
      (request) => categoryService.getAll(request.userId),
    );

    fastify.post(
      "/",
      {
        onRequest: [verifyUserId],
        schema: {
          body: createCategoryInputSchema,
          response: {
            201: categorySchema,
            409: errorSchema,
          },
        },
      },
      async (request, reply) => {
        try {
          const category = await categoryService.create(
            request.body,
            request.userId,
          );
          reply.status(201).header("Location", `/categories/${category.id}`);
          return category;
        } catch (err) {
          if (err instanceof CategoryAlreadyExistsError) {
            return reply.status(409).send({ error: err.message });
          }
          throw err;
        }
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
        await categoryService.delete(request.params.id, request.userId);
        reply.status(204).send();
      },
    );
  },
});

const errorSchema = z.object({ error: z.string() });
