import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMock } from "../common/testing/create-mock.ts";
import { BudgetRepository } from "./budget-repository-factory.ts";
import {
  BudgetService,
  budgetServiceFactory,
} from "./budget-service-factory.ts";
import type { Budget } from "./budget-entity.ts";

const budgetRepository = createMock<BudgetRepository>();

describe("budgetService", () => {
  let budgetService: BudgetService;

  beforeEach(() => {
    vi.clearAllMocks();
    budgetService = budgetServiceFactory({ budgetRepository });
  });

  describe("getAll", () => {
    describe("given the repository returns budgets", () => {
      const budgets: Budget[] = [
        { id: "1", categoryId: "cat-1", limitInEuro: 300 },
        { id: "2", categoryId: "cat-2", limitInEuro: 1000 },
      ];
      let result: Budget[];

      beforeEach(async () => {
        budgetRepository.findAll.mockResolvedValue(budgets);
        result = await budgetService.getAll("user-1");
      });

      it("should return them", () => {
        expect(result).toEqual(budgets);
      });

      it("should call repository.findAll once", () => {
        expect(budgetRepository.findAll).toHaveBeenCalledOnce();
      });
    });
  });

  describe("create", () => {
    describe("given valid input", () => {
      const input = { categoryId: "cat-1", limitInEuro: 300 };
      const created: Budget = { id: "abc", ...input };
      let result: Budget;

      beforeEach(async () => {
        budgetRepository.create.mockResolvedValue(created);
        result = await budgetService.create(input, "user-1");
      });

      it("should return the result from repository.create", () => {
        expect(result).toEqual(created);
      });

      it("should call repository.create with the input", () => {
        expect(budgetRepository.create).toHaveBeenCalledWith(input, "user-1");
      });
    });
  });

  describe("delete", () => {
    describe("given an id", () => {
      beforeEach(async () => {
        await budgetService.delete("bud-1", "user-1");
      });

      it("should call repository.delete with the id", () => {
        expect(budgetRepository.delete).toHaveBeenCalledWith("bud-1", "user-1");
      });
    });
  });
});
