import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance, LightMyRequestResponse } from "fastify";
import { fastifyFactory } from "../fastify-factory.ts";
import type { Transaction } from "./transaction-entity.ts";
import { createMock } from "../common/testing/create-mock.ts";
import { TransactionService } from "./transaction-service-factory.ts";
import { transactionRoutesFactory } from "./transaction-routes-factory.ts";
import type { VerifyUserId } from "../core/auth/verify-user-id.ts";

const transactionService = createMock<TransactionService>();
const verifyUserId: VerifyUserId = (req, _reply, done) => {
  req.userId = "user-1";
  done();
};

describe("transaction routes", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await fastifyFactory({
      logger: false,
      routes: [transactionRoutesFactory({ transactionService, verifyUserId })],
      requestDecorators: [{ name: "userId", initialValue: "" }],
    }).create();
    vi.clearAllMocks();
  });

  describe("GET /transactions", () => {
    describe("given the service returns a list of transactions", () => {
      const transactions: Transaction[] = [
        { id: "1", title: "Salary", amountInEuro: 3000, timestamp: "2026-01-01", categoryId: null },
        { id: "2", title: "Rent", amountInEuro: -800, timestamp: "2026-01-02", categoryId: null },
      ];
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        transactionService.getAll.mockResolvedValue(transactions);
        response = await app.inject({ method: "GET", url: "/transactions" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return the transactions as JSON", () => {
        expect(response.json()).toEqual(transactions);
      });
    });

    describe("given the service returns an empty list", () => {
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        transactionService.getAll.mockResolvedValue([]);
        response = await app.inject({ method: "GET", url: "/transactions" });
      });

      it("should respond with 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an empty array", () => {
        expect(response.json()).toEqual([]);
      });
    });
  });

  describe("POST /transactions", () => {
    describe("given a valid request body", () => {
      const input = { title: "Bonus", amountInEuro: 500, timestamp: "2026-02-01", categoryId: null };
      const created: Transaction = { id: "abc-123", ...input };
      let response: LightMyRequestResponse;

      beforeEach(async () => {
        transactionService.create.mockResolvedValue(created);
        response = await app.inject({
          method: "POST",
          url: "/transactions",
          payload: input,
        });
      });

      it("should respond with 201", () => {
        expect(response.statusCode).toBe(201);
      });

      it("should return the created transaction", () => {
        expect(response.json()).toEqual(created);
      });

      it("should set the Location header to the transaction URL", () => {
        expect(response.headers["location"]).toBe("/transactions/abc-123");
      });

      it("should call service.create with the request body", () => {
        expect(transactionService.create).toHaveBeenCalledWith(input, "user-1");
      });
    });

    describe("given a body with a missing title", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/transactions",
          payload: { amountInEuro: 100, timestamp: "2026-02-01", categoryId: null },
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe("given a body with a missing amountInEuro", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/transactions",
          payload: { title: "Test", timestamp: "2026-02-01", categoryId: null },
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe("given a body with an empty title", () => {
      it("should respond with 400", async () => {
        const response = await app.inject({
          method: "POST",
          url: "/transactions",
          payload: { title: "", amountInEuro: 100, timestamp: "2026-02-01", categoryId: null },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });
});
