import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance, LightMyRequestResponse } from "fastify";
import { fastifyFactory } from "../fastify-factory.ts";
import type { Category } from "./category-entity.ts";
import { createMock } from "../common/testing/create-mock.ts";
import { CategoryService } from "./category-service-factory.ts";
import { categoryRoutesFactory } from "./category-routes-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";

const categoryService = createMock<CategoryService>();
const verifyUserId: VerifyUserId = (req, _reply, done) => {
  req.userId = "user-1";
  done();
};

describe("category routes", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await fastifyFactory({
      logger: false,
      routes: [categoryRoutesFactory({ categoryService, verifyUserId })],
      requestDecorators: [{ name: "userId", initialValue: "" }],
    }).create();
    vi.clearAllMocks();
  });

  describe("GET /categories", () => {
    describe("given the service returns a list of categories", () => {
      const categories: Category[] = [
        { id: "1", name: "Groceries" },
        { id: "2", name: "Rent" },
      ];
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        categoryService.getAll.mockResolvedValue(categories);
        response = await app.inject({ method: "GET", url: "/categories" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return the categories as JSON", () => {
        expect(response.json()).toEqual(categories);
      });
    });

    describe("given the service returns an empty list", () => {
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        categoryService.getAll.mockResolvedValue([]);
        response = await app.inject({ method: "GET", url: "/categories" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an empty array", () => {
        expect(response.json()).toEqual([]);
      });
    });
  });

  describe("POST /categories", () => {
    describe("given a valid request body", () => {
      const input = { name: "Groceries" };
      const created: Category = { id: "abc-123", name: "Groceries" };
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        categoryService.create.mockResolvedValue(created);
        response = await app.inject({
          method: "POST",
          url: "/categories",
          payload: input,
        });
      });

      it("should respond with 201", () => {
        expect(response.statusCode).toBe(201);
      });

      it("should return the created category", () => {
        expect(response.json()).toEqual(created);
      });

      it("should set the Location header to the category URL", () => {
        expect(response.headers["location"]).toBe("/categories/abc-123");
      });

      it("should call service.create with the request body", () => {
        expect(categoryService.create).toHaveBeenCalledWith(input, "user-1");
      });
    });

    describe("given a body with a missing name", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/categories",
          payload: {},
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe("given a body with an empty name", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/categories",
          payload: { name: "" },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });

  describe("DELETE /categories/:id", () => {
    describe("given an existing id", () => {
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        response = await app.inject({
          method: "DELETE",
          url: "/categories/cat-1",
        });
      });

      it("should respond with 204", () => {
        expect(response.statusCode).toBe(204);
      });

      it("should call service.delete with the id", () => {
        expect(categoryService.delete).toHaveBeenCalledWith("cat-1", "user-1");
      });
    });
  });
});
