import { useMutation } from "@tanstack/react-query";
import { transactionsQueryOptions } from "./transactionQueries.ts";
import { apiClient, type Transaction } from "@/core/http/apiClient.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export const useAddTransaction = () => {
  const userId = useUserId();
  const transactionsKey = transactionsQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const { id: _, ...input } = transaction;
      const { data, error } = await apiClient.POST("/transactions/", {
        body: input,
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    onMutate: async (newTransaction, context) => {
      await context.client.cancelQueries({ queryKey: transactionsKey });
      const previousTransactions = context.client.getQueryData(transactionsKey);
      context.client.setQueryData<Transaction[]>(
        transactionsKey,
        (transactions) => [...(transactions ?? []), newTransaction],
      );
      return { previousTransactions };
    },
    onError: (_error, _, onMutateResult, context) => {
      context.client.setQueryData(
        transactionsKey,
        onMutateResult?.previousTransactions,
      );
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: transactionsKey });
    },
  });

  return {
    ...result,
    addTransaction: result.mutateAsync,
  };
};

export const useDeleteTransaction = () => {
  const userId = useUserId();
  const transactionsKey = transactionsQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/transactions/{id}", {
        params: { path: { id } },
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
    },
    onMutate: async (id, context) => {
      await context.client.cancelQueries({ queryKey: transactionsKey });
      const previousTransactions = context.client.getQueryData(transactionsKey);
      context.client.setQueryData<Transaction[]>(
        transactionsKey,
        (transactions) => transactions?.filter((t) => t.id !== id) ?? [],
      );
      return { previousTransactions };
    },
    onError: (_error, _, onMutateResult, context) => {
      context.client.setQueryData(
        transactionsKey,
        onMutateResult?.previousTransactions,
      );
    },
    onSettled: (_data, _error, _variables, _, context) => {
      context.client.invalidateQueries({ queryKey: transactionsKey });
    },
  });

  return {
    ...result,
    deleteTransaction: result.mutate,
  };
};
