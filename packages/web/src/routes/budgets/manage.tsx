import { createFileRoute } from "@tanstack/react-router";
import { BudgetManagePage } from "../../features/budgets/BudgetManagePage.tsx";
import { categoriesQueryOptions } from "../../features/categories/categoryQueries.ts";
import { budgetsQueryOptions } from "../../features/budgets/budgetQueries.ts";
import { RoutePendingComponent } from "../../common/components/RoutePendingComponent.tsx";
import { RouteErrorComponent } from "../../common/components/RouteErrorComponent.tsx";

export const Route = createFileRoute("/budgets/manage")({
  loader: ({ context: { queryClient, userId } }) =>
    Promise.all([
      queryClient.ensureQueryData(categoriesQueryOptions(userId)),
      queryClient.ensureQueryData(budgetsQueryOptions(userId)),
    ]),
  pendingComponent: RoutePendingComponent,
  errorComponent: RouteErrorComponent,
  component: BudgetManagePage,
});
