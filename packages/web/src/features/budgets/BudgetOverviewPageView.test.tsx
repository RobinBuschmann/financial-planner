import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetOverviewPageView } from "./BudgetOverviewPageView.tsx";
import type { BudgetProgress } from "./computeBudgetProgress.ts";

const makeProgress = (
  name: string,
  spentInEuro: number,
  limitInEuro: number,
  percentage: number,
): BudgetProgress => ({
  budget: { id: `bud-${name}`, categoryId: `cat-${name}`, limitInEuro },
  category: { id: `cat-${name}`, name },
  spentInEuro,
  limitInEuro,
  percentage,
});

describe("given no budget progress entries", () => {
  beforeEach(() => {
    render(<BudgetOverviewPageView progress={[]} />);
  });

  it("shows the empty state message", () => {
    expect(screen.getByText("No budgets set up yet.")).toBeInTheDocument();
  });

  it("shows the hint to go to Manage", () => {
    expect(
      screen.getByText("Go to Manage to add categories and budgets."),
    ).toBeInTheDocument();
  });
});

describe("given a list of budget progress entries", () => {
  const progress = [
    makeProgress("Groceries", 150, 300, 50),
    makeProgress("Rent", 800, 1000, 80),
  ];

  beforeEach(() => {
    render(<BudgetOverviewPageView progress={progress} />);
  });

  it("renders each category name", () => {
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
  });

  it("renders the progress indicator at the correct value", () => {
    const card = screen.getByText("Groceries").closest(
      "[data-slot='card']",
    )!;
    const bar = card.querySelector("[data-slot='progress-indicator']")!;
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("does not show an over-budget warning", () => {
    expect(screen.queryByText(/Over budget/)).not.toBeInTheDocument();
  });
});

describe("given a budget that is over the limit", () => {
  beforeEach(() => {
    render(
      <BudgetOverviewPageView
        progress={[makeProgress("Dining", 350, 300, 116.67)]}
      />,
    );
  });

  it("shows the over-budget warning", () => {
    expect(screen.getByText(/Over budget by/)).toBeInTheDocument();
  });

  it("renders the progress indicator", () => {
    const card = screen.getByText("Dining").closest(
      "[data-slot='card']",
    )!;
    expect(card.querySelector("[data-slot='progress-indicator']")).toBeInTheDocument();
  });

  it("caps the progress bar width at 100%", () => {
    const card = screen.getByText("Dining").closest(
      "[data-slot='card']",
    )!;
    const bar = card.querySelector("[data-slot='progress-indicator']")!;
    expect(bar).toHaveStyle({ width: "100%" });
  });
});
