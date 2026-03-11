import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMock } from "../common/testing/create-mock.ts";
import { UserRepository } from "./user-repository-factory.ts";
import { UserService, userServiceFactory } from "./user-service-factory.ts";
import type { User } from "./user-dtos.ts";

const userRepository = createMock<UserRepository>();

let userService: UserService;

beforeEach(() => {
  vi.clearAllMocks();
  userService = userServiceFactory({ userRepository });
});

describe("create", () => {
  describe("given the repository returns a user", () => {
    const user: User = { id: "abc-123" };
    let result: User;

    beforeEach(async () => {
      userRepository.create.mockResolvedValue(user);
      result = await userService.create();
    });

    it("should return the result from repository.create", () => {
      expect(result).toEqual(user);
    });

    it("should call repository.create once", () => {
      expect(userRepository.create).toHaveBeenCalledOnce();
    });
  });
});
