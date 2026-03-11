import { Route } from "../core/routes/route.ts";
import type { UserService } from "./user-service-factory.ts";
import { userSchema } from "./user-entity.ts";

export type UserRoutesOptions = { userService: UserService };
export const userRoutesFactory = ({ userService }: UserRoutesOptions): Route => ({
  path: "/users",
  async apply(fastify) {
    fastify.post(
      "/",
      {
        schema: {
          response: {
            201: userSchema,
          },
        },
      },
      async (_, reply) => {
        const user = await userService.create();
        reply.status(201);
        return user;
      },
    );
  },
});
