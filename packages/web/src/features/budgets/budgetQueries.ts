import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiClient, type Budget } from "../../core/http/apiClient.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export const budgetsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["budgets", userId],
    queryFn: async (): Promise<Budget[]> => {
      const { data, error } = await apiClient.GET("/budgets/", {
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

export const useBudgets = () => {
  const userId = useUserId();
  const result = useQuery(budgetsQueryOptions(userId));
  return {
    ...result,
    budgets: result.data ?? [],
  };
};
