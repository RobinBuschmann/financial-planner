import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  type Budget,
  type CreateBudgetInput,
} from "../../core/http/apiClient.ts";
import { budgetsQueryOptions } from "./budgetQueries.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export const useAddBudget = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const budgetsKey = budgetsQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (input: CreateBudgetInput): Promise<Budget> => {
      const { data, error } = await apiClient.POST("/budgets/", {
        body: input,
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKey });
    },
  });

  return {
    ...result,
    addBudget: result.mutateAsync,
  };
};

export const useDeleteBudget = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const budgetsKey = budgetsQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/budgets/{id}", {
        params: { path: { id } },
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKey });
    },
  });

  return {
    ...result,
    deleteBudget: result.mutateAsync,
  };
};
