import createClient from "openapi-fetch";
import type { paths } from "./schema.d.ts";

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

type ResponseBody<T> = T extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : T extends {
        responses: { 201: { content: { "application/json": infer R } } };
      }
    ? R
    : never;

type RequestBody<T> = T extends {
  requestBody: { content: { "application/json": infer B } };
}
  ? B
  : never;

export type Transaction = ResponseBody<paths["/transactions/"]["get"]>[number];
export type CreateTransactionInput = RequestBody<
  paths["/transactions/"]["post"]
>;

export type Category = ResponseBody<paths["/categories/"]["get"]>[number];
export type CreateCategoryInput = RequestBody<paths["/categories/"]["post"]>;

export type Budget = ResponseBody<paths["/budgets/"]["get"]>[number];
export type CreateBudgetInput = RequestBody<paths["/budgets/"]["post"]>;
