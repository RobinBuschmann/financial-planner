import { useAddTransaction } from "./transactionMutations.ts";
import { AddTransactionCardView } from "./AddTransactionCardView.tsx";
import { useCategories } from "../categories/categoryQueries.ts";

export const AddTransactionCard = () => {
  const { addTransaction } = useAddTransaction();
  const { categories } = useCategories();
  return (
    <AddTransactionCardView
      onAddTransaction={addTransaction}
      categories={categories}
    />
  );
};
