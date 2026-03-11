import type { User } from "./user-dtos.ts";
import type { UserRepository } from "./user-repository-factory.ts";

type UserServiceOptions = { userRepository: UserRepository };
export type UserService = ReturnType<typeof userServiceFactory>;
export const userServiceFactory = ({ userRepository }: UserServiceOptions) => ({
  async create(): Promise<User> {
    return userRepository.create();
  },
});
