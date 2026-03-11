import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMock } from "../common/testing/create-mock.ts";
import { TransactionRepository } from "./transaction-repository-factory.ts";
import {
  TransactionService,
  transactionServiceFactory,
} from "./transaction-service-factory.ts";
import type { Transaction } from "./transaction-dtos.ts";

const transactionRepository = createMock<TransactionRepository>();

let transactionService: TransactionService;

beforeEach(() => {
  vi.clearAllMocks();
  transactionService = transactionServiceFactory({ transactionRepository });
});

describe("getAll", () => {
  describe("given the repository returns transactions", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        title: "Salary",
        amountInEuro: 3000,
        timestamp: "2026-01-01",
        categoryId: null,
      },
    ];
    let result: Transaction[];

    beforeEach(async () => {
      transactionRepository.findAll.mockResolvedValue(transactions);
      result = await transactionService.getAll("user-1");
    });

    it("should return them", () => {
      expect(result).toEqual(transactions);
    });

    it("should call repository.findAll once", () => {
      expect(transactionRepository.findAll).toHaveBeenCalledOnce();
    });
  });
});

describe("create", () => {
  describe("given valid input", () => {
    const input = {
      title: "Rent",
      amountInEuro: -800,
      timestamp: "2026-01-02",
      categoryId: null,
    };
    const created: Transaction = { id: "abc", ...input };
    let result: Transaction;

    beforeEach(async () => {
      transactionRepository.create.mockResolvedValue(created);
      result = await transactionService.create(input, "user-1");
    });

    it("should return the result from repository.create", () => {
      expect(result).toEqual(created);
    });

    it("should call repository.create with the input", () => {
      expect(transactionRepository.create).toHaveBeenCalledWith(
        input,
        "user-1",
      );
    });
  });
});
