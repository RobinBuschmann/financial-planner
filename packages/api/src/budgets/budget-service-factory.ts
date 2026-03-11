import type { Budget, CreateBudgetInput } from "./budget-dtos.ts";
import type { BudgetRepository } from "./budget-repository-factory.ts";

type BudgetServiceOptions = {
  budgetRepository: BudgetRepository;
};
export type BudgetService = ReturnType<typeof budgetServiceFactory>;
export const budgetServiceFactory = ({
  budgetRepository,
}: BudgetServiceOptions) => ({
  async getAll(userId: string): Promise<Budget[]> {
    return budgetRepository.findAll(userId);
  },
  async create(input: CreateBudgetInput, userId: string): Promise<Budget> {
    return budgetRepository.create(input, userId);
  },
  async delete(id: string, userId: string): Promise<void> {
    return budgetRepository.delete(id, userId);
  },
});
