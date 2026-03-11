import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance, LightMyRequestResponse } from "fastify";
import { fastifyFactory } from "../fastify-factory.ts";
import type { User } from "./user-dtos.ts";
import { createMock } from "../common/testing/create-mock.ts";
import { UserService } from "./user-service-factory.ts";
import { userRoutesFactory } from "./user-routes-factory.ts";

const userService = createMock<UserService>();

let app: FastifyInstance;

beforeEach(async () => {
  app = await fastifyFactory({
    logger: false,
    routes: [userRoutesFactory({ userService })],
    requestDecorators: [],
  }).create();
  vi.clearAllMocks();
});

describe("POST /users", () => {
  describe("given the service creates a user", () => {
    const user: User = { id: "abc-123" };
    let response: LightMyRequestResponse;

    beforeEach(async () => {
      userService.create.mockResolvedValue(user);
      response = await app.inject({ method: "POST", url: "/users" });
    });

    it("should respond with 201", () => {
      expect(response.statusCode).toBe(201);
    });

    it("should return the created user", () => {
      expect(response.json()).toEqual(user);
    });

    it("should call service.create once", () => {
      expect(userService.create).toHaveBeenCalledOnce();
    });
  });
});
