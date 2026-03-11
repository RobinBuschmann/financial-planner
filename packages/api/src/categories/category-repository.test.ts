import { beforeEach, describe, expect, it } from "vitest";
import { inmemoryDatabaseFactory } from "../core/testing/inmemory-database-factory.ts";
import {
  CategoryRepository,
  categoryRepositoryFactory,
} from "./category-repository-factory.ts";
import type { Category } from "./category-dtos.ts";

let repo: CategoryRepository;

beforeEach(() => {
  repo = categoryRepositoryFactory({ database: inmemoryDatabaseFactory() });
});

describe("findAll", () => {
  describe("given no categories have been created", () => {
    it("should return an empty array", async () => {
      expect(await repo.findAll("user-1")).toEqual([]);
    });
  });

  describe("given multiple categories have been created", () => {
    let a: Category;
    let b: Category;

    beforeEach(async () => {
      a = await repo.create({ name: "Groceries" }, "user-1");
      b = await repo.create({ name: "Rent" }, "user-1");
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
    it("should return the category with all input fields", async () => {
      const result = await repo.create({ name: "Groceries" }, "user-1");

      expect(result.name).toBe("Groceries");
    });

    it("should assign a non-empty string id", async () => {
      const result = await repo.create({ name: "Groceries" }, "user-1");

      expect(result.id).toBeTypeOf("string");
      expect(result.id).not.toBe("");
    });

    it("should persist the category so findAll can retrieve it", async () => {
      const created = await repo.create({ name: "Groceries" }, "user-1");

      expect(await repo.findAll("user-1")).toContainEqual(created);
    });
  });

  describe("given two separate create calls", () => {
    it("should assign a unique id to each", async () => {
      const a = await repo.create({ name: "Groceries" }, "user-1");
      const b = await repo.create({ name: "Rent" }, "user-1");

      expect(a.id).not.toBe(b.id);
    });
  });
});

describe("delete", () => {
  describe("given a category that exists", () => {
    it("should remove it from findAll", async () => {
      const created = await repo.create({ name: "Groceries" }, "user-1");
      await repo.delete(created.id, "user-1");

      expect(await repo.findAll("user-1")).not.toContainEqual(created);
    });
  });
});
