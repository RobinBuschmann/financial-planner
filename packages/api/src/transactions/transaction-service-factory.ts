import type {
  CreateTransactionInput,
  Transaction,
} from "./transaction-dtos.ts";
import { TransactionRepository } from "./transaction-repository-factory.ts";

type TransactionServiceOptions = {
  transactionRepository: TransactionRepository;
};
export type TransactionService = ReturnType<typeof transactionServiceFactory>;
export const transactionServiceFactory = ({
  transactionRepository,
}: TransactionServiceOptions) => ({
  async getAll(userId: string): Promise<Transaction[]> {
    return transactionRepository.findAll(userId);
  },
  async create(
    input: CreateTransactionInput,
    userId: string,
  ): Promise<Transaction> {
    return transactionRepository.create(input, userId);
  },
  async delete(id: string, userId: string): Promise<void> {
    return transactionRepository.delete(id, userId);
  },
});
