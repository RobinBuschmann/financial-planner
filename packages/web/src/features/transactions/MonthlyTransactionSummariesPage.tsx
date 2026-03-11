import { useMonthlyTransactionSummaries } from "./useMonthlyTransactionSummaries.ts";
import { MonthlyTransactionSummariesPageView } from "./MonthlyTransactionSummariesPageView.tsx";

export const MonthlyTransactionSummariesPage = () => {
  const { summaries } = useMonthlyTransactionSummaries();
  return <MonthlyTransactionSummariesPageView summaries={summaries} />;
};
