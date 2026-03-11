import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiClient, type Transaction } from "@/core/http/apiClient.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export type TransactionWithBalance = Transaction & { runningBalance: number };

export const transactionsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/transactions/", {
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    select: (data): TransactionWithBalance[] => {
      let runningBalance = 0;
      return [...data]
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        .map((t) => {
          runningBalance += t.amountInEuro;
          return { ...t, runningBalance };
        })
        .reverse();
    },
  });

export const useTransactions = () => {
  const userId = useUserId();
  const result = useQuery(transactionsQueryOptions(userId));
  return {
    ...result,
    transactions: result.data ?? [],
  };
};
