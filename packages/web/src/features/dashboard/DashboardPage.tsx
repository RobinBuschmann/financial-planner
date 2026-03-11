import { useTransactions } from "../transactions/transactionQueries.ts";
import { useBudgetProgress } from "../budgets/useBudgetProgress.ts";
import { DashboardPageView } from "./DashboardPageView.tsx";

export const DashboardPage = () => {
  const { transactions } = useTransactions();
  const { progress } = useBudgetProgress();
  return (
    <DashboardPageView
      transactions={transactions}
      progress={progress}
    />
  );
};
