import { MonthlyTransactionSummary } from "./MonthlyTransactionSummary.ts";
import { TransactionWithBalance, useTransactions } from "./transactionQueries.ts";

export const useMonthlyTransactionSummaries = () => {
  const { transactions, isPending, isError, error } = useTransactions();
  return { summaries: computeMonthlySummaries(transactions), isPending, isError, error };
};

export const computeMonthlySummaries = (
  transactions: TransactionWithBalance[],
): MonthlyTransactionSummary[] => {
  const summaryMap = [...transactions]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .reduce((summaryMap, { timestamp, amountInEuro, runningBalance }) => {
      const monthKey = timestamp.slice(0, 7);
      const [year, month] = monthKey.split("-");
      const {
        label,
        income: previousIncome,
        expenses: previousExpenses,
      } = summaryMap.get(monthKey) ?? {
        income: 0,
        expenses: 0,
        label: new Date(
          Number(year),
          Number(month) - 1,
          1,
        ).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      };
      const currentIncome = amountInEuro >= 0 ? amountInEuro : 0;
      const currentExpenses = amountInEuro < 0 ? Math.abs(amountInEuro) : 0;
      summaryMap.set(monthKey, {
        key: monthKey,
        label,
        balance: runningBalance,
        income: previousIncome + currentIncome,
        expenses: previousExpenses + currentExpenses,
      });
      return summaryMap;
    }, new Map<string, MonthlyTransactionSummary>());

  return [...summaryMap.values()].toReversed();
};
