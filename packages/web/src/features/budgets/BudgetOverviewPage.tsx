import { useBudgetProgress } from "./useBudgetProgress.ts";
import { BudgetOverviewPageView } from "./BudgetOverviewPageView.tsx";

export const BudgetOverviewPage = () => {
  const { progress } = useBudgetProgress();
  return <BudgetOverviewPageView progress={progress} />;
};
