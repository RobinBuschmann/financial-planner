import { test, expect, type Page } from "@playwright/test";
import { refreshUser } from "./utils/refreshUser.ts";

/**
 * Test scenario:
 *   TX1 – "Salary"    +2000 € on 15 Jan 2026  (month A)
 *   TX2 – "Groceries" −100 € on  5 Feb 2026  (month B)
 *   TX3 – "Freelance" +500 € on 20 Feb 2026  (month B)
 *
 * Expected account balance: 2000 − 100 + 500 = +2 400 €
 *
 * Expected monthly summaries (most-recent first):
 *   Feb 2026 | income +500 | expenses −100 | end balance +2 400
 *   Jan 2026 | income +2 000 | expenses 0 | end balance +2 000
 */

const TRANSACTIONS = [
  { title: "Salary", amount: "2000", datetime: "2026-01-15T12:00" },
  { title: "Groceries", amount: "-100", datetime: "2026-02-05T10:00" },
  { title: "Freelance", amount: "500", datetime: "2026-02-20T14:00" },
] as const;

async function addTransaction(
  page: Page,
  tx: { title: string; amount: string; datetime: string },
) {
  await page.getByLabel("Title").fill(tx.title);
  await page.getByLabel("Amount (€)").fill(tx.amount);
  await page.getByLabel("Date & Time").fill(tx.datetime);
  await page.getByRole("button", { name: "Add Transaction" }).click();

  await expect(page.getByRole("cell", { name: tx.title })).toBeVisible({
    timeout: 10_000,
  });
}

// The loading skeleton also renders a <tbody>, so we scope to the real table by
// matching one of its known column headers.
function realTableRows(page: Page, headerName: string) {
  return page
    .locator("table")
    .filter({ has: page.getByRole("columnheader", { name: headerName }) })
    .locator("tbody tr");
}

test("create transactions across two months and verify overview and balance", async ({
  page,
  request,
}) => {
  await refreshUser(page, request);

  // Navigate to the index child route directly to ensure the Outlet renders
  await page.goto("/transactions/");

  // ── Add all three transactions ──────────────────────────────────────────────
  for (const tx of TRANSACTIONS) {
    await addTransaction(page, tx);
  }

  // ── All-transactions tab ────────────────────────────────────────────────────
  // Transactions are displayed most-recent first: Freelance → Groceries → Salary
  const rows = realTableRows(page, "Date");
  await expect(rows).toHaveCount(3);

  const freelanceRow = rows.nth(0);
  await expect(freelanceRow).toContainText("Freelance");
  await expect(freelanceRow).toContainText("500,00");

  const groceriesRow = rows.nth(1);
  await expect(groceriesRow).toContainText("Groceries");
  await expect(groceriesRow).toContainText("100,00");

  const salaryRow = rows.nth(2);
  await expect(salaryRow).toContainText("Salary");
  await expect(salaryRow).toContainText("2.000,00");

  // ── Account balance card ────────────────────────────────────────────────────
  // 2000 − 100 + 500 = 2 400
  const balanceCard = page.locator("p.text-3xl");
  await expect(balanceCard).toContainText("2.400,00");

  // ── Monthly-summaries tab ───────────────────────────────────────────────────
  await page.getByRole("tab", { name: "Monthly" }).click();

  const monthlyRows = realTableRows(page, "Month");
  await expect(monthlyRows).toHaveCount(2);

  const febRow = monthlyRows.nth(0);
  await expect(febRow).toContainText("Feb 2026");
  await expect(febRow.locator("td").nth(1)).toContainText("500,00"); // income
  await expect(febRow.locator("td").nth(2)).toContainText("100,00"); // expenses
  await expect(febRow.locator("td").nth(3)).toContainText("2.400,00"); // end balance

  const janRow = monthlyRows.nth(1);
  await expect(janRow).toContainText("Jan 2026");
  await expect(janRow.locator("td").nth(1)).toContainText("2.000,00"); // income
  await expect(janRow.locator("td").nth(2)).toContainText("0,00"); // expenses
  await expect(janRow.locator("td").nth(3)).toContainText("2.000,00"); // end balance
});
