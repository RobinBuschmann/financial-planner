import type { Budget, Category } from "@/core/http/apiClient.ts";
import { AddCategoryCard } from "./AddCategoryCard.tsx";
import { AddBudgetCard } from "./AddBudgetCard.tsx";

type BudgetManagePageViewProps = {
  categories: Category[];
  budgets: Budget[];
  onAddCategory: (input: { name: string }) => Promise<unknown>;
  onDeleteCategory: (id: string) => Promise<unknown>;
  onAddBudget: (input: {
    categoryId: string;
    limitInEuro: number;
  }) => Promise<unknown>;
  onDeleteBudget: (id: string) => Promise<unknown>;
};

export const BudgetManagePageView = ({
  categories,
  budgets,
  onAddCategory,
  onDeleteCategory,
  onAddBudget,
  onDeleteBudget,
}: BudgetManagePageViewProps) => (
  <div className="space-y-8">
    <AddCategoryCard
      categories={categories}
      onAdd={onAddCategory}
      onDelete={onDeleteCategory}
    />
    <AddBudgetCard
      categories={categories}
      budgets={budgets}
      onAdd={onAddBudget}
      onDelete={onDeleteBudget}
    />
  </div>
);
