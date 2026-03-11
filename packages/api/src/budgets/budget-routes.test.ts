import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance, LightMyRequestResponse } from "fastify";
import { fastifyFactory } from "../fastify-factory.ts";
import type { Budget } from "./budget-entity.ts";
import { createMock } from "../common/testing/create-mock.ts";
import { BudgetService } from "./budget-service-factory.ts";
import { budgetRoutesFactory } from "./budget-routes-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";

const budgetService = createMock<BudgetService>();
const verifyUserId: VerifyUserId = (req, _reply, done) => {
  req.userId = "user-1";
  done();
};

describe("budget routes", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await fastifyFactory({
      logger: false,
      routes: [budgetRoutesFactory({ budgetService, verifyUserId })],
      requestDecorators: [{ name: "userId", initialValue: "" }],
    }).create();
    vi.clearAllMocks();
  });

  describe("GET /budgets", () => {
    describe("given the service returns a list of budgets", () => {
      const budgets: Budget[] = [
        { id: "1", categoryId: "cat-1", limitInEuro: 300 },
        { id: "2", categoryId: "cat-2", limitInEuro: 1000 },
      ];
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        budgetService.getAll.mockResolvedValue(budgets);
        response = await app.inject({ method: "GET", url: "/budgets" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return the budgets as JSON", () => {
        expect(response.json()).toEqual(budgets);
      });
    });

    describe("given the service returns an empty list", () => {
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        budgetService.getAll.mockResolvedValue([]);
        response = await app.inject({ method: "GET", url: "/budgets" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an empty array", () => {
        expect(response.json()).toEqual([]);
      });
    });
  });

  describe("POST /budgets", () => {
    describe("given a valid request body", () => {
      const input = { categoryId: "cat-1", limitInEuro: 300 };
      const created: Budget = { id: "abc-123", ...input };
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        budgetService.create.mockResolvedValue(created);
        response = await app.inject({
          method: "POST",
          url: "/budgets",
          payload: input,
        });
      });

      it("should respond with 201", () => {
        expect(response.statusCode).toBe(201);
      });

      it("should return the created budget", () => {
        expect(response.json()).toEqual(created);
      });

      it("should set the Location header to the budget URL", () => {
        expect(response.headers["location"]).toBe("/budgets/abc-123");
      });

      it("should call service.create with the request body", () => {
        expect(budgetService.create).toHaveBeenCalledWith(input, "user-1");
      });
    });

    describe("given a body with a missing categoryId", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/budgets",
          payload: { limitInEuro: 300 },
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe("given a body with a missing limitInEuro", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/budgets",
          payload: { categoryId: "cat-1" },
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe("given a body with an empty categoryId", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/budgets",
          payload: { categoryId: "", limitInEuro: 300 },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });

  describe("DELETE /budgets/:id", () => {
    describe("given an existing id", () => {
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        response = await app.inject({
          method: "DELETE",
          url: "/budgets/bud-1",
        });
      });

      it("should respond with 204", () => {
        expect(response.statusCode).toBe(204);
      });

      it("should call service.delete with the id", () => {
        expect(budgetService.delete).toHaveBeenCalledWith("bud-1", "user-1");
      });
    });
  });
});
