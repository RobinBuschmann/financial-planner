import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryAlreadyExistsError } from "./category-already-exists-error.ts";
import { createMock } from "../common/testing/create-mock.ts";
import { CategoryRepository } from "./category-repository-factory.ts";
import {
  CategoryService,
  categoryServiceFactory,
} from "./category-service-factory.ts";
import type { Category } from "./category-dtos.ts";

const categoryRepository = createMock<CategoryRepository>();

let categoryService: CategoryService;

beforeEach(() => {
  vi.clearAllMocks();
  categoryService = categoryServiceFactory({ categoryRepository });
});

describe("getAll", () => {
  describe("given the repository returns categories", () => {
    const categories: Category[] = [
      { id: "1", name: "Groceries" },
      { id: "2", name: "Rent" },
    ];
    let result: Category[];

    beforeEach(async () => {
      categoryRepository.findAll.mockResolvedValue(categories);
      result = await categoryService.getAll("user-1");
    });

    it("should return them", () => {
      expect(result).toEqual(categories);
    });

    it("should call repository.findAll once", () => {
      expect(categoryRepository.findAll).toHaveBeenCalledOnce();
    });
  });
});

describe("create", () => {
  describe("given valid input", () => {
    const input = { name: "Groceries" };
    const created: Category = { id: "abc", ...input };
    let result: Category;

    beforeEach(async () => {
      categoryRepository.findAll.mockResolvedValue([]);
      categoryRepository.create.mockResolvedValue(created);
      result = await categoryService.create(input, "user-1");
    });

    it("should return the result from repository.create", () => {
      expect(result).toEqual(created);
    });

    it("should call repository.create with the input", () => {
      expect(categoryRepository.create).toHaveBeenCalledWith(input, "user-1");
    });
  });

  describe("given a category with the same name already exists", () => {
    let result: unknown;

    beforeEach(async () => {
      categoryRepository.findAll.mockResolvedValue([
        { id: "1", name: "Groceries" },
      ]);
      result = await categoryService
        .create({ name: "Groceries" }, "user-1")
        .catch((e) => e);
    });

    it("should return a CategoryAlreadyExistsError", () => {
      expect(result).toBeInstanceOf(CategoryAlreadyExistsError);
    });

    it("should not call repository.create", () => {
      expect(categoryRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("given a category with the same name exists in different casing", () => {
    let result: unknown;

    beforeEach(async () => {
      categoryRepository.findAll.mockResolvedValue([
        { id: "1", name: "Groceries" },
      ]);
      result = await categoryService
        .create({ name: "groceries" }, "user-1")
        .catch((e) => e);
    });

    it("should return a CategoryAlreadyExistsError", () => {
      expect(result).toBeInstanceOf(CategoryAlreadyExistsError);
    });
  });
});

describe("delete", () => {
  describe("given an id", () => {
    beforeEach(async () => {
      await categoryService.delete("cat-1", "user-1");
    });

    it("should call repository.delete with the id", () => {
      expect(categoryRepository.delete).toHaveBeenCalledWith("cat-1", "user-1");
    });
  });
});
