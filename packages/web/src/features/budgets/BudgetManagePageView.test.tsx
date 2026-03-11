import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Suspense } from "react";
import { BudgetManagePageView } from "./BudgetManagePageView.tsx";
import type { Budget, Category } from "@/core/http/apiClient.ts";

const categories: Category[] = [
  { id: "cat-1", name: "Groceries" },
  { id: "cat-2", name: "Rent" },
];

const budgets: Budget[] = [
  { id: "bud-1", categoryId: "cat-1", limitInEuro: 300 },
];

const renderView = ({
  cats = categories,
  buds = budgets,
  onAddCategory = vi.fn().mockResolvedValue(undefined),
  onDeleteCategory = vi.fn().mockResolvedValue(undefined),
  onAddBudget = vi.fn().mockResolvedValue(undefined),
  onDeleteBudget = vi.fn().mockResolvedValue(undefined),
} = {}) =>
  render(
    <Suspense fallback={null}>
      <BudgetManagePageView
        categories={cats}
        budgets={buds}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onAddBudget={onAddBudget}
        onDeleteBudget={onDeleteBudget}
      />
    </Suspense>,
  );

describe("given categories and budgets", () => {
  it("renders each category name", async () => {
    renderView();
    // "Groceries" appears in categories list + budgets list = 2
    expect(await screen.findAllByText("Groceries")).toHaveLength(2);
    // "Rent" appears in categories list only (select options render on open)
    expect(await screen.findByText("Rent")).toBeInTheDocument();
  });

  it("renders the budget limit", async () => {
    renderView();
    expect(await screen.findByText("€300.00 / month")).toBeInTheDocument();
  });

  it("calls onDeleteCategory with the correct id when its delete button is clicked", async () => {
    const onDeleteCategory = vi.fn().mockResolvedValue(undefined);
    renderView({ onDeleteCategory });
    // First "Groceries" in the DOM is the one in the categories list
    const categoryItem = (await screen.findAllByText("Groceries"))[0].closest(
      '[data-slot="item"]',
    )!;
    fireEvent.click(categoryItem.querySelector("button")!);
    expect(onDeleteCategory).toHaveBeenCalledWith("cat-1");
  });

  it("calls onDeleteBudget with the correct id when its delete button is clicked", async () => {
    const onDeleteBudget = vi.fn().mockResolvedValue(undefined);
    renderView({ onDeleteBudget });
    const budgetItem = (await screen.findByText("€300.00 / month")).closest(
      '[data-slot="item"]',
    )!;
    fireEvent.click(budgetItem.querySelector("button")!);
    expect(onDeleteBudget).toHaveBeenCalledWith("bud-1");
  });
});

describe("given no categories", () => {
  beforeEach(() => {
    renderView({ cats: [], buds: [] });
  });

  it("shows the prompt to add a category first", async () => {
    expect(
      await screen.findByText("Add a category first to create a budget."),
    ).toBeInTheDocument();
  });

  it("does not render any list items", async () => {
    await screen.findByText("Add a category first to create a budget.");
    expect(document.querySelectorAll('[data-slot="item"]')).toHaveLength(0);
  });
});

describe("given no budgets", () => {
  it("does not render any budget list items", async () => {
    renderView({ buds: [] });
    // Wait for the form to load, then verify no limits are shown
    await screen.findByRole("button", { name: "Add Budget" });
    expect(screen.queryByText(/€.*\/ month/)).not.toBeInTheDocument();
  });
});
