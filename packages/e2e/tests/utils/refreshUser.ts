import { APIRequestContext, expect, Page } from "@playwright/test";

export const refreshUser = async (page: Page, request: APIRequestContext) => {
  const USER_ID_KEY = "fp_user_id";
  const API_URL = `http://localhost:${process.env.API_PORT ?? 3000}`;
  // Create a fresh user for this test run — guarantees a clean data scope
  // without touching the database directly.
  const userResponse = await request.post(`${API_URL}/users`);
  expect(userResponse.status()).toBe(201);
  const { id: userId } = await userResponse.json();

  // Inject the userId into localStorage before the app boots so that
  // getOrCreateUserId() finds it and skips the POST /users call.
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: USER_ID_KEY, value: userId },
  );
};
