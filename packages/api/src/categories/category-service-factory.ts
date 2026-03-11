import type { Category, CreateCategoryInput } from "./category-dtos.ts";
import type { CategoryRepository } from "./category-repository-factory.ts";
import { CategoryAlreadyExistsError } from "./category-already-exists-error.ts";

type CategoryServiceOptions = {
  categoryRepository: CategoryRepository;
};
export type CategoryService = ReturnType<typeof categoryServiceFactory>;
export const categoryServiceFactory = ({
  categoryRepository,
}: CategoryServiceOptions) => ({
  async getAll(userId: string): Promise<Category[]> {
    return categoryRepository.findAll(userId);
  },
  async create(input: CreateCategoryInput, userId: string): Promise<Category> {
    const existing = await categoryRepository.findAll(userId);
    const alreadyExists = existing.some(
      ({ name }) => name.toLowerCase() === input.name.toLowerCase(),
    );
    if (alreadyExists) {
      throw new CategoryAlreadyExistsError(input.name);
    }
    return categoryRepository.create(input, userId);
  },
  async delete(id: string, userId: string): Promise<void> {
    return categoryRepository.delete(id, userId);
  },
});
