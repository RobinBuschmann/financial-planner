import type { FastifyReply, FastifyRequest } from "fastify";
import type { RequestDecorator } from "../routes/request-decorator.ts";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export type VerifyUserId = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => void;

export const userIdDecoratorFactory = (): RequestDecorator => ({
  name: "userId",
  initialValue: "",
});

export const verifyUserIdFactory = (): VerifyUserId =>
  (request, reply, done) => {
    const value = request.headers["x-user-id"];
    if (!value || Array.isArray(value)) {
      reply.status(401).send({ error: "X-User-Id header required" });
      return;
    }
    request.userId = value;
    done();
  };
