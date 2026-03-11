import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { transactions } from "./transactions-schema.ts";
import {
  TransactionRepository,
  transactionRepositoryFactory,
} from "./transaction-repository-factory.ts";
import type { Transaction } from "./transaction-entity.ts";

const makeDb = () => {
  const client = new Database(":memory:");
  const db = drizzle({ client, schema: { transactions } });
  client.exec(`
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount_in_euro REAL NOT NULL,
      timestamp TEXT NOT NULL,
      category_id TEXT,
      user_id TEXT
    )
  `);
  return db;
};

describe("transactionRepository", () => {
  let repo: TransactionRepository;

  beforeEach(() => {
    repo = transactionRepositoryFactory({ database: makeDb() });
  });

  describe("findAll", () => {
    describe("given no transactions have been created", () => {
      it("should return an empty array", async () => {
        expect(await repo.findAll("user-1")).toEqual([]);
      });
    });

    describe("given multiple transactions have been created", () => {
      let a: Transaction;
      let b: Transaction;

      beforeEach(async () => {
        a = await repo.create({ title: "Salary", amountInEuro: 3000, timestamp: "2026-01-01", categoryId: null }, "user-1");
        b = await repo.create({ title: "Rent", amountInEuro: -800, timestamp: "2026-01-02", categoryId: null }, "user-1");
      });

      it("should return all of them", async () => {
        const all = await repo.findAll("user-1");
        expect(all).toHaveLength(2);
        expect(all).toContainEqual(a);
        expect(all).toContainEqual(b);
      });
    });
  });

  describe("create", () => {
    describe("given a valid input", () => {
      it("should return the transaction with all input fields", async () => {
        const result = await repo.create({
          title: "Grocery",
          amountInEuro: -45.5,
          timestamp: "2026-02-01",
          categoryId: null,
        }, "user-1");

        expect(result.title).toBe("Grocery");
        expect(result.amountInEuro).toBe(-45.5);
        expect(result.timestamp).toBe("2026-02-01");
        expect(result.categoryId).toBeNull();
      });

      it("should assign a non-empty string id", async () => {
        const result = await repo.create({
          title: "Grocery",
          amountInEuro: -45.5,
          timestamp: "2026-02-01",
          categoryId: null,
        }, "user-1");

        expect(result.id).toBeTypeOf("string");
        expect(result.id).not.toBe("");
      });

      it("should persist the transaction so findAll can retrieve it", async () => {
        const created = await repo.create({
          title: "Bonus",
          amountInEuro: 500,
          timestamp: "2026-02-15",
          categoryId: null,
        }, "user-1");

        expect(await repo.findAll("user-1")).toContainEqual(created);
      });
    });

    describe("given two separate create calls", () => {
      it("should assign a unique id to each", async () => {
        const a = await repo.create({ title: "A", amountInEuro: 1, timestamp: "2026-01-01", categoryId: null }, "user-1");
        const b = await repo.create({ title: "B", amountInEuro: 2, timestamp: "2026-01-02", categoryId: null }, "user-1");

        expect(a.id).not.toBe(b.id);
      });
    });
  });
});
