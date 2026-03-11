import { useBudgets } from "./budgetQueries.ts";
import { useCategories } from "../categories/categoryQueries.ts";
import { useTransactions } from "../transactions/transactionQueries.ts";
import { computeBudgetProgress } from "./computeBudgetProgress.ts";

export const useBudgetProgress = () => {
  const { budgets, isPending: isLoadingBudgets, isError: isBudgetsError } = useBudgets();
  const { categories, isPending: isLoadingCategories, isError: isCategoriesError } = useCategories();
  const { transactions, isPending: isLoadingTransactions, isError: isTransactionsError } = useTransactions();
  const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  return {
    progress: computeBudgetProgress(budgets, categories, transactions, month),
    isPending: isLoadingBudgets || isLoadingCategories || isLoadingTransactions,
    isError: isBudgetsError || isCategoriesError || isTransactionsError,
  };
};
