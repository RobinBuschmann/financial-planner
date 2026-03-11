import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonthlyTransactionSummariesPageView } from "./MonthlyTransactionSummariesPageView.tsx";
import { MonthlyTransactionSummary } from "./MonthlyTransactionSummary.ts";

const summary = (
  key: string,
  label: string,
  income: number,
  expenses: number,
  balance: number,
): MonthlyTransactionSummary => ({ key, label, income, expenses, balance });

describe("given no summaries", () => {
  beforeEach(() => {
    render(<MonthlyTransactionSummariesPageView summaries={[]} />);
  });

  it("shows the empty state message", () => {
    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  it("does not render a table", () => {
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("given a list of summaries", () => {
  const summaries = [
    summary("2026-02", "Feb 2026", 3000, 500, 3700),
    summary("2026-01", "Jan 2026", 1200, 0, 1200),
  ];

  beforeEach(() => {
    render(<MonthlyTransactionSummariesPageView summaries={summaries} />);
  });

  it("renders a row for each summary", () => {
    expect(screen.getAllByRole("row")).toHaveLength(3); // 1 header + 2 data rows
  });

  it("renders each month label", () => {
    expect(screen.getByText("Feb 2026")).toBeInTheDocument();
    expect(screen.getByText("Jan 2026")).toBeInTheDocument();
  });

  it("applies text-green-600 class to a positive end balance", () => {
    const febRow = screen.getByText("Feb 2026").closest("tr")!;
    const balanceCell = febRow.querySelectorAll("td")[3];
    expect(balanceCell).toHaveClass("text-green-600");
  });
});

describe("given a summary with a negative balance", () => {
  beforeEach(() => {
    render(
      <MonthlyTransactionSummariesPageView
        summaries={[summary("2026-01", "Jan 2026", 0, 500, -500)]}
      />,
    );
  });

  it("applies text-destructive class to a negative end balance", () => {
    const row = screen.getByText("Jan 2026").closest("tr")!;
    const balanceCell = row.querySelectorAll("td")[3];
    expect(balanceCell).toHaveClass("text-destructive");
  });
});
