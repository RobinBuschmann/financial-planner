import { createFileRoute } from "@tanstack/react-router";
import { BudgetPage } from "../features/budgets/BudgetPage.tsx";

export const Route = createFileRoute("/budgets")({
  component: BudgetPage,
});
