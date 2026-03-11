import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AllTransactionsPageView } from "./AllTransactionsPageView.tsx";
import type { TransactionWithBalance } from "./transactionQueries.ts";

const tx = (
  id: string,
  title: string,
  amountInEuro: number,
  timestamp: string,
): TransactionWithBalance => ({
  id,
  title,
  amountInEuro,
  timestamp,
  categoryId: null,
  runningBalance: 0,
});

const defaultProps = {
  allTransactions: [],
  onDelete: () => {},
  categories: [],
  categoryId: undefined,
  onCategoryChange: () => {},
};

describe("given no transactions", () => {
  beforeEach(() => {
    render(<AllTransactionsPageView {...defaultProps} transactions={[]} />);
  });

  it("shows the empty state message", () => {
    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  it("does not render a table", () => {
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("given a list of transactions", () => {
  const transactions = [
    tx("1", "Salary", 2000, "2026-01-15T10:00:00.000Z"),
    tx("2", "Rent", -800, "2026-01-01T10:00:00.000Z"),
  ];

  beforeEach(() => {
    render(<AllTransactionsPageView {...defaultProps} transactions={transactions} allTransactions={transactions} />);
  });

  it("renders a row for each transaction", () => {
    expect(screen.getAllByRole("row")).toHaveLength(3); // 1 header + 2 data rows
  });

  it("renders each transaction title", () => {
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
  });

  it("applies text-green-600 class to positive amounts", () => {
    const salaryCell = screen.getByText("Salary").closest("tr")!;
    const amountCell = salaryCell.querySelectorAll("td")[2];
    expect(amountCell).toHaveClass("text-green-600");
  });

  it("applies text-green-600 class to positive amounts and text-destructive to negative", () => {
    const rentCell = screen.getByText("Rent").closest("tr")!;
    const amountCell = rentCell.querySelectorAll("td")[2];
    expect(amountCell).toHaveClass("text-destructive");
  });
});
