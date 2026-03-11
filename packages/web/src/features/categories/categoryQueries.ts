import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/core/http/apiClient.ts";
import { useUserId } from "../users/UserIdProvider.tsx";

export const categoriesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["categories", userId],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/categories/", {
        headers: { "X-User-Id": userId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

export const useCategories = () => {
  const userId = useUserId();
  const result = useQuery(categoriesQueryOptions(userId));
  return {
    ...result,
    categories: result.data ?? [],
  };
};
