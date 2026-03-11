import { Outlet } from "@tanstack/react-router";
import { AddTransactionCard } from "./AddTransactionCard.tsx";
import { LinkTabs, LinkTab } from "@/components/ui/link-tabs.tsx";

export const TransactionPage = () => (
  <div className="max-w-xl mx-auto px-4 py-10">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your income and expenses</p>
    </div>

    <AddTransactionCard />

    <LinkTabs className="mb-6">
      <LinkTab to="/transactions">All</LinkTab>
      <LinkTab to="/transactions/monthly">Monthly</LinkTab>
    </LinkTabs>

    <Outlet />
  </div>
);
