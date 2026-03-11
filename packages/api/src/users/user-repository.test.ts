import { beforeEach, describe, expect, it } from "vitest";
import { inmemoryDatabaseFactory } from "../core/testing/inmemory-database-factory.ts";
import {
  UserRepository,
  userRepositoryFactory,
} from "./user-repository-factory.ts";

let repo: UserRepository;

beforeEach(() => {
  repo = userRepositoryFactory({ database: inmemoryDatabaseFactory() });
});

describe("create", () => {
  it("should assign a non-empty string id", async () => {
    const result = await repo.create();

    expect(result.id).toBeTypeOf("string");
    expect(result.id).not.toBe("");
  });

  describe("given two separate create calls", () => {
    it("should assign a unique id to each", async () => {
      const a = await repo.create();
      const b = await repo.create();

      expect(a.id).not.toBe(b.id);
    });
  });
});
