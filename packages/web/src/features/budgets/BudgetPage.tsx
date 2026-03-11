import { Outlet } from "@tanstack/react-router";
import { LinkTabs, LinkTab } from "@/components/ui/link-tabs.tsx";

export const BudgetPage = () => (
  <div className="max-w-xl mx-auto px-4 py-10">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track your spending against monthly limits
      </p>
    </div>

    <LinkTabs className="mb-6">
      <LinkTab to="/budgets">Overview</LinkTab>
      <LinkTab to="/budgets/manage">Manage</LinkTab>
    </LinkTabs>

    <Outlet />
  </div>
);
