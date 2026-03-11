import { apiClient } from "../../core/http/apiClient.ts";

const USER_ID_KEY = "fp_user_id";

export async function getOrCreateUserId(): Promise<string> {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const { data, error } = await apiClient.POST("/users/", {});
  if (error) throw error;
  localStorage.setItem(USER_ID_KEY, data.id);
  return data.id;
}
