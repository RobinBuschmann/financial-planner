import type { Budget, Category } from "../../core/http/apiClient.ts";
import type { TransactionWithBalance } from "../transactions/transactionQueries.ts";

export type BudgetProgress = {
  budget: Budget;
  category: Category;
  spentInEuro: number;
  limitInEuro: number;
  percentage: number;
};

export const computeBudgetProgress = (
  budgets: Budget[],
  categories: Category[],
  transactions: TransactionWithBalance[],
  month: string, // "YYYY-MM"
): BudgetProgress[] => {
  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  return budgets
    .filter((budget) => categoriesById.has(budget.categoryId))
    .map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.categoryId === budget.categoryId &&
            t.timestamp.startsWith(month) &&
            t.amountInEuro < 0,
        )
        .reduce((sum, t) => sum + Math.abs(t.amountInEuro), 0);
      return {
        budget,
        category: categoriesById.get(budget.categoryId)!,
        spentInEuro: spent,
        limitInEuro: budget.limitInEuro,
        percentage:
          budget.limitInEuro > 0 ? (spent / budget.limitInEuro) * 100 : 0,
      };
    });
};
