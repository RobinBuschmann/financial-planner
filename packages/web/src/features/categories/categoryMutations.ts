import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, type CreateCategoryInput } from "@/core/http/apiClient.ts";
import { categoriesQueryOptions } from "./categoryQueries.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export const useAddCategory = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const categoriesKey = categoriesQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const { data, error } = await apiClient.POST("/categories/", {
        body: input,
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
    },
  });

  return {
    ...result,
    addCategory: result.mutateAsync,
  };
};

export const useDeleteCategory = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const categoriesKey = categoriesQueryOptions(userId).queryKey;
  const result = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/categories/{id}", {
        params: { path: { id } },
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
    },
  });

  return {
    ...result,
    deleteCategory: result.mutateAsync,
  };
};
