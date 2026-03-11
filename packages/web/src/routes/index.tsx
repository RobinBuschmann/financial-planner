import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../features/dashboard/DashboardPage.tsx";
import { transactionsQueryOptions } from "../features/transactions/transactionQueries.ts";
import { categoriesQueryOptions } from "../features/categories/categoryQueries.ts";
import { budgetsQueryOptions } from "../features/budgets/budgetQueries.ts";
import { RoutePendingComponent } from "../common/components/RoutePendingComponent.tsx";
import { RouteErrorComponent } from "../common/components/RouteErrorComponent.tsx";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient, userId } }) =>
    Promise.all([
      queryClient.ensureQueryData(transactionsQueryOptions(userId)),
      queryClient.ensureQueryData(categoriesQueryOptions(userId)),
      queryClient.ensureQueryData(budgetsQueryOptions(userId)),
    ]),
  pendingComponent: RoutePendingComponent,
  errorComponent: RouteErrorComponent,
  component: DashboardPage,
});
