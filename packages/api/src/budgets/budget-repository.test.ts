import { beforeEach, describe, expect, it } from "vitest";
import { inmemoryDatabaseFactory } from "../core/testing/inmemory-database-factory.ts";
import {
  BudgetRepository,
  budgetRepositoryFactory,
} from "./budget-repository-factory.ts";
import type { Budget } from "./budget-dtos.ts";

let repo: BudgetRepository;

beforeEach(() => {
  repo = budgetRepositoryFactory({ database: inmemoryDatabaseFactory() });
});

describe("findAll", () => {
  describe("given no budgets have been created", () => {
    it("should return an empty array", async () => {
      expect(await repo.findAll("user-1")).toEqual([]);
    });
  });

  describe("given multiple budgets have been created", () => {
    let a: Budget;
    let b: Budget;

    beforeEach(async () => {
      a = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );
      b = await repo.create(
        { categoryId: "cat-2", limitInEuro: 1000 },
        "user-1",
      );
    });

    it("should return all of them", async () => {
      const all = await repo.findAll("user-1");
      expect(all).toHaveLength(2);
      expect(all).toContainEqual(a);
      expect(all).toContainEqual(b);
    });
  });
});

describe("create", () => {
  describe("given a valid input", () => {
    it("should return the budget with all input fields", async () => {
      const result = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );

      expect(result.categoryId).toBe("cat-1");
      expect(result.limitInEuro).toBe(300);
    });

    it("should assign a non-empty string id", async () => {
      const result = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );

      expect(result.id).toBeTypeOf("string");
      expect(result.id).not.toBe("");
    });

    it("should persist the budget so findAll can retrieve it", async () => {
      const created = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );

      expect(await repo.findAll("user-1")).toContainEqual(created);
    });
  });

  describe("given two separate create calls", () => {
    it("should assign a unique id to each", async () => {
      const a = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );
      const b = await repo.create(
        { categoryId: "cat-2", limitInEuro: 1000 },
        "user-1",
      );

      expect(a.id).not.toBe(b.id);
    });
  });
});

describe("delete", () => {
  describe("given a budget that exists", () => {
    it("should remove it from findAll", async () => {
      const created = await repo.create(
        { categoryId: "cat-1", limitInEuro: 300 },
        "user-1",
      );
      await repo.delete(created.id, "user-1");

      expect(await repo.findAll("user-1")).not.toContainEqual(created);
    });
  });
});
