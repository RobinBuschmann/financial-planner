import { createFileRoute } from "@tanstack/react-router";
import { TransactionPage } from "../features/transactions/TransactionPage.tsx";

export const Route = createFileRoute("/transactions")({
  component: TransactionPage,
});
