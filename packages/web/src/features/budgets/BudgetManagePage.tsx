import { useCategories } from "../categories/categoryQueries.ts";
import { useBudgets } from "./budgetQueries.ts";
import { useAddCategory, useDeleteCategory } from "../categories/categoryMutations.ts";
import { useAddBudget, useDeleteBudget } from "./budgetMutations.ts";
import { BudgetManagePageView } from "./BudgetManagePageView.tsx";

export const BudgetManagePage = () => {
  const { categories } = useCategories();
  const { budgets } = useBudgets();
  const { addCategory } = useAddCategory();
  const { deleteCategory } = useDeleteCategory();
  const { addBudget } = useAddBudget();
  const { deleteBudget } = useDeleteBudget();

  return (
    <BudgetManagePageView
      categories={categories}
      budgets={budgets}
      onAddCategory={addCategory}
      onDeleteCategory={deleteCategory}
      onAddBudget={addBudget}
      onDeleteBudget={deleteBudget}
    />
  );
};
