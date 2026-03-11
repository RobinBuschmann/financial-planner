import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTransactions } from "./transactionQueries.ts";
import { useDeleteTransaction } from "./transactionMutations.ts";
import { useCategories } from "../categories/categoryQueries.ts";
import { AllTransactionsPageView } from "./AllTransactionsPageView.tsx";

export const AllTransactionsPage = () => {
  const { transactions } = useTransactions();
  const { deleteTransaction } = useDeleteTransaction();
  const { categories } = useCategories();
  const { categoryId } = useSearch({ from: "/transactions/" });
  const navigate = useNavigate({ from: "/transactions/" });

  const filtered = categoryId
    ? transactions.filter(
        (transaction) => transaction.categoryId === categoryId,
      )
    : transactions;

  const handleCategoryChange = (categoryId: string) => {
    navigate({ search: (prev) => ({ ...prev, categoryId }) });
  };

  return (
    <AllTransactionsPageView
      transactions={filtered}
      allTransactions={transactions}
      onDelete={deleteTransaction}
      categories={categories}
      categoryId={categoryId}
      onCategoryChange={handleCategoryChange}
    />
  );
};
