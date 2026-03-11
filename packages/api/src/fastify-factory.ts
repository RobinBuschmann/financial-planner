import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import type { Route } from "./core/routes/route.ts";
import type { RequestDecorator } from "./core/routes/request-decorator.ts";

type FastifyOptions = {
  logger?: boolean;
  routes: Route[];
  requestDecorators: RequestDecorator[];
};
export const fastifyFactory = (options: FastifyOptions) => ({
  async create() {
    const app = Fastify({ logger: options.logger ?? true });

    app.setSerializerCompiler(serializerCompiler);
    app.setValidatorCompiler(validatorCompiler);

    await app.register(swagger, {
      openapi: {
        info: { title: "Financial Planner API", version: "1.0.0" },
      },
      transform: jsonSchemaTransform,
    });

    await app.register(cors, {
      origin: process.env.CORS_ORIGIN ?? "http://localhost:3001",
    });

    options.requestDecorators.forEach(({ name, initialValue }) =>
      app.decorateRequest(name, initialValue),
    );

    options.routes.forEach((route) =>
      app.register(route.apply.bind(route), { prefix: route.path }),
    );

    return app;
  },
});
