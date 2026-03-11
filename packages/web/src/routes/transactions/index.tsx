import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AllTransactionsPage } from "../../features/transactions/AllTransactionsPage.tsx";
import { transactionsQueryOptions } from "../../features/transactions/transactionQueries.ts";
import { categoriesQueryOptions } from "../../features/categories/categoryQueries.ts";
import { RoutePendingComponent } from "../../common/components/RoutePendingComponent.tsx";
import { RouteErrorComponent } from "../../common/components/RouteErrorComponent.tsx";

const searchSchema = z.object({
  categoryId: z.string().optional(),
});

export const Route = createFileRoute("/transactions/")({
  validateSearch: searchSchema,
  loader: ({ context: { queryClient, userId } }) =>
    Promise.all([
      queryClient.ensureQueryData(transactionsQueryOptions(userId)),
      queryClient.ensureQueryData(categoriesQueryOptions(userId)),
    ]),
  pendingComponent: RoutePendingComponent,
  errorComponent: RouteErrorComponent,
  component: AllTransactionsPage,
});
