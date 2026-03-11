import { Link } from "@tanstack/react-router";
import { AccountBalanceCardView } from "../transactions/AccountBalanceCardView.tsx";
import { BudgetOverviewPageView } from "../budgets/BudgetOverviewPageView.tsx";
import type { TransactionWithBalance } from "../transactions/transactionQueries.ts";
import type { BudgetProgress } from "../budgets/computeBudgetProgress.ts";

type DashboardPageViewProps = {
  transactions: TransactionWithBalance[];
  progress: BudgetProgress[];
};

export const DashboardPageView = ({
  transactions,
  progress,
}: DashboardPageViewProps) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">
            Account Balance
          </h2>
          <Link
            to="/transactions"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <AccountBalanceCardView transactions={transactions} />
      </section>

      {progress.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">
              Budget Spending
            </h2>
            <Link to="/budgets" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <BudgetOverviewPageView progress={progress} />
        </section>
      )}
    </div>
  );
};
