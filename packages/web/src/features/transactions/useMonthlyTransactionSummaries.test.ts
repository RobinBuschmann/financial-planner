import { beforeEach, describe, expect, it } from "vitest";
import { computeMonthlySummaries } from "./useMonthlyTransactionSummaries.ts";
import { MonthlyTransactionSummary } from "./MonthlyTransactionSummary.ts";
import { TransactionWithBalance } from "./transactionQueries.ts";

const tx = (
  id: string,
  amountInEuro: number,
  timestamp: string,
  runningBalance: number,
): TransactionWithBalance => ({ id, title: id, amountInEuro, timestamp, runningBalance, categoryId: null });

describe("computeMonthlySummaries", () => {
  describe("given an empty array", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([]);
    });
    it("should return an empty array", () => {
      expect(result).toEqual([]);
    });
  });

  describe("given a single positive transaction", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([tx("1", 1000, "2026-01-15T10:00:00.000Z", 1000)]);
    });
    it("should return one entry", () => {
      expect(result).toHaveLength(1);
    });
    it('should set the month key to "2026-01"', () => {
      expect(result[0].key).toBe("2026-01");
    });
    it("should record the amount as income", () => {
      expect(result[0].income).toBe(1000);
    });
    it("should set expenses to 0", () => {
      expect(result[0].expenses).toBe(0);
    });
    it("should set balance to the income", () => {
      expect(result[0].balance).toBe(1000);
    });
    it('should format the label as "Jan 2026"', () => {
      expect(result[0].label).toBe("Jan 2026");
    });
  });

  describe("given a single negative transaction", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([tx("1", -400, "2026-01-15T10:00:00.000Z", -400)]);
    });
    it("should set income to 0", () => {
      expect(result[0].income).toBe(0);
    });
    it("should record the absolute amount as expenses", () => {
      expect(result[0].expenses).toBe(400);
    });
    it("should set balance to the negative amount", () => {
      expect(result[0].balance).toBe(-400);
    });
  });

  describe("given a transaction with zero amount", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([tx("1", 0, "2026-01-01T00:00:00.000Z", 0)]);
    });
    it("should count it as income", () => {
      expect(result[0].income).toBe(0);
    });
    it("should not add to expenses", () => {
      expect(result[0].expenses).toBe(0);
    });
  });

  describe("given multiple transactions in the same month", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([
        tx("1", 2000, "2026-01-01T00:00:00.000Z", 2000),
        tx("2", -150, "2026-01-15T00:00:00.000Z", 1850),
        tx("3", 500,  "2026-01-28T00:00:00.000Z", 2350),
      ]);
    });
    it("should produce one entry", () => {
      expect(result).toHaveLength(1);
    });
    it("should sum incomes", () => {
      expect(result[0].income).toBe(2500);
    });
    it("should sum expenses", () => {
      expect(result[0].expenses).toBe(150);
    });
    it("should set balance to the runningBalance of the last transaction", () => {
      expect(result[0].balance).toBe(2350);
    });
  });

  describe("given transactions across multiple months", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([
        tx("1", 1000, "2026-01-01T00:00:00.000Z", 1000),
        tx("2", -300, "2026-02-01T00:00:00.000Z", 700),
        tx("3", 200,  "2026-03-01T00:00:00.000Z", 900),
      ]);
    });
    it("should produce one entry per month", () => {
      expect(result).toHaveLength(3);
    });
    it("should accumulate balance chronologically", () => {
      // newest first → [Mar, Feb, Jan]
      expect(result[2].balance).toBe(1000); // Jan
      expect(result[1].balance).toBe(700);  // Jan + Feb: 1000 - 300
      expect(result[0].balance).toBe(900);  // + Mar: 700 + 200
    });
  });

  describe("given months provided in non-chronological input order", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([
        tx("1", 100, "2026-01-01T00:00:00.000Z", 100),
        tx("2", 200, "2026-03-01T00:00:00.000Z", 600),
        tx("3", 300, "2026-02-01T00:00:00.000Z", 400),
      ]);
    });
    it("should return entries ordered newest month first", () => {
      expect(result.map((s) => s.key)).toEqual(["2026-03", "2026-02", "2026-01"]);
    });
  });

  describe("given transactions in non-chronological order", () => {
    let result: MonthlyTransactionSummary[];
    beforeEach(() => {
      result = computeMonthlySummaries([
        tx("2", 300, "2026-02-15T00:00:00.000Z", 600),
        tx("1", 100, "2026-01-10T00:00:00.000Z", 100),
        tx("3", 200, "2026-02-05T00:00:00.000Z", 300),
      ]);
    });
    it("should group them correctly by month", () => {
      expect(result).toHaveLength(2);
      expect(result[0].key).toBe("2026-02");
      expect(result[0].income).toBe(500);
      expect(result[1].key).toBe("2026-01");
      expect(result[1].income).toBe(100);
    });
  });

  describe("given a mutable input array", () => {
    let transactions: TransactionWithBalance[];
    let original: TransactionWithBalance[];
    beforeEach(() => {
      transactions = [
        tx("2", 200, "2026-02-01T00:00:00.000Z", 300),
        tx("1", 100, "2026-01-01T00:00:00.000Z", 100),
      ];
      original = [...transactions];
      computeMonthlySummaries(transactions);
    });
    it("should not mutate it", () => {
      expect(transactions).toEqual(original);
    });
  });
});
