import { describe, expect, it } from "vitest";
import { computeBudgetProgress } from "./computeBudgetProgress.ts";
import type { Budget, Category } from "../../core/http/apiClient.ts";
import type { TransactionWithBalance } from "../transactions/transactionQueries.ts";

const categories: Category[] = [
  { id: "cat-1", name: "Groceries" },
  { id: "cat-2", name: "Rent" },
];

const budgets: Budget[] = [
  { id: "bud-1", categoryId: "cat-1", limitInEuro: 300 },
  { id: "bud-2", categoryId: "cat-2", limitInEuro: 1000 },
];

const makeTransaction = (
  overrides: Partial<TransactionWithBalance>,
): TransactionWithBalance => ({
  id: "t-1",
  title: "Test",
  amountInEuro: -50,
  timestamp: "2026-03-15T12:00:00.000Z",
  categoryId: "cat-1",
  runningBalance: 0,
  ...overrides,
});

describe("computeBudgetProgress", () => {
  it("computes spent amount for a category in the given month", () => {
    const transactions = [
      makeTransaction({ amountInEuro: -100, categoryId: "cat-1" }),
      makeTransaction({ amountInEuro: -50, categoryId: "cat-1" }),
    ];
    const result = computeBudgetProgress(
      budgets,
      categories,
      transactions,
      "2026-03",
    );
    const groceries = result.find((r) => r.budget.id === "bud-1")!;
    expect(groceries.spentInEuro).toBe(150);
    expect(groceries.limitInEuro).toBe(300);
    expect(groceries.percentage).toBe(50);
  });

  it("excludes transactions from other months", () => {
    const transactions = [
      makeTransaction({
        amountInEuro: -100,
        categoryId: "cat-1",
        timestamp: "2026-02-15T12:00:00.000Z",
      }),
    ];
    const result = computeBudgetProgress(
      budgets,
      categories,
      transactions,
      "2026-03",
    );
    const groceries = result.find((r) => r.budget.id === "bud-1")!;
    expect(groceries.spentInEuro).toBe(0);
    expect(groceries.percentage).toBe(0);
  });

  it("excludes positive (income) transactions", () => {
    const transactions = [
      makeTransaction({ amountInEuro: 100, categoryId: "cat-1" }),
    ];
    const result = computeBudgetProgress(
      budgets,
      categories,
      transactions,
      "2026-03",
    );
    const groceries = result.find((r) => r.budget.id === "bud-1")!;
    expect(groceries.spentInEuro).toBe(0);
  });

  it("excludes transactions from other categories", () => {
    const transactions = [
      makeTransaction({ amountInEuro: -200, categoryId: "cat-2" }),
    ];
    const result = computeBudgetProgress(
      budgets,
      categories,
      transactions,
      "2026-03",
    );
    const groceries = result.find((r) => r.budget.id === "bud-1")!;
    expect(groceries.spentInEuro).toBe(0);
    const rent = result.find((r) => r.budget.id === "bud-2")!;
    expect(rent.spentInEuro).toBe(200);
  });

  it("returns 0 percentage when limit is 0", () => {
    const zeroBudgets: Budget[] = [
      { id: "bud-zero", categoryId: "cat-1", limitInEuro: 0 },
    ];
    const transactions = [
      makeTransaction({ amountInEuro: -50, categoryId: "cat-1" }),
    ];
    const result = computeBudgetProgress(
      zeroBudgets,
      categories,
      transactions,
      "2026-03",
    );
    expect(result[0].percentage).toBe(0);
  });

  it("returns empty array when no budgets", () => {
    const result = computeBudgetProgress([], categories, [], "2026-03");
    expect(result).toEqual([]);
  });

  it("skips budgets whose category is not in the categories list", () => {
    const orphanBudget: Budget[] = [
      { id: "bud-orphan", categoryId: "cat-missing", limitInEuro: 100 },
    ];
    const result = computeBudgetProgress(
      orphanBudget,
      categories,
      [],
      "2026-03",
    );
    expect(result).toEqual([]);
  });
});
