import { createFileRoute } from "@tanstack/react-router";
import { MonthlyTransactionSummariesPage } from "../../features/transactions/MonthlyTransactionSummariesPage.tsx";
import { transactionsQueryOptions } from "../../features/transactions/transactionQueries.ts";
import { RoutePendingComponent } from "../../common/components/RoutePendingComponent.tsx";
import { RouteErrorComponent } from "../../common/components/RouteErrorComponent.tsx";

export const Route = createFileRoute("/transactions/monthly")({
  loader: ({ context: { queryClient, userId } }) =>
    queryClient.ensureQueryData(transactionsQueryOptions(userId)),
  pendingComponent: RoutePendingComponent,
  errorComponent: RouteErrorComponent,
  component: MonthlyTransactionSummariesPage,
});
