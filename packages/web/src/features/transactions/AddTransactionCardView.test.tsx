import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { AddTransactionCardView } from "./AddTransactionCardView.tsx";

const renderForm = (onAddTransaction = vi.fn().mockResolvedValue(undefined)) =>
  render(
    <Suspense fallback={null}>
      <AddTransactionCardView onAddTransaction={onAddTransaction} categories={[]} />
    </Suspense>,
  );

describe("given the form is rendered", () => {
  beforeEach(() => {
    renderForm();
  });

  it("should show the Title field", async () => {
    expect(await screen.findByLabelText("Title")).toBeInTheDocument();
  });

  it("should show the Amount field", async () => {
    expect(await screen.findByLabelText("Amount (€)")).toBeInTheDocument();
  });

  it("should show the Add Transaction button", async () => {
    expect(
      await screen.findByRole("button", { name: "Add Transaction" }),
    ).toBeInTheDocument();
  });
});

describe("given the form is submitted without filling the title", () => {
  beforeEach(async () => {
    renderForm();
    fireEvent.change(await screen.findByLabelText("Amount (€)"), {
      target: { value: "1000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
  });

  it("should show a 'Title is required' error", async () => {
    expect(await screen.findByText("Title is required")).toBeInTheDocument();
  });
});

describe("given the form is submitted without filling the amount", () => {
  beforeEach(async () => {
    renderForm();
    fireEvent.change(await screen.findByLabelText("Title"), {
      target: { value: "Salary" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
  });

  it("should show an 'Amount is required' error", async () => {
    expect(await screen.findByText("Amount is required")).toBeInTheDocument();
  });
});

describe("given the form is submitted with a zero amount", () => {
  beforeEach(async () => {
    renderForm();
    fireEvent.change(await screen.findByLabelText("Title"), {
      target: { value: "Salary" },
    });
    fireEvent.change(screen.getByLabelText("Amount (€)"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
  });

  it("should show an amount validation error", async () => {
    expect(
      await screen.findByText("Amount must be greater or less than 0"),
    ).toBeInTheDocument();
  });
});

describe("given the form is submitted with valid values", () => {
  let onAddTransaction: Mock;

  beforeEach(async () => {
    onAddTransaction = vi.fn().mockResolvedValue(undefined);
    renderForm(onAddTransaction);
    fireEvent.change(await screen.findByLabelText("Title"), {
      target: { value: "Salary" },
    });
    fireEvent.change(screen.getByLabelText("Amount (€)"), {
      target: { value: "3000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
  });

  it("should call onAddTransaction with the entered title and amount", async () => {
    await waitFor(() => {
      expect(onAddTransaction).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Salary", amountInEuro: 3000 }),
      );
    });
  });

  it("should reset the title field after submission", async () => {
    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toHaveValue("");
    });
  });
});
