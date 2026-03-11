import { randomUUID } from "crypto";
import type { Database } from "../core/database/database-factory.ts";
import type { User } from "./user-entity.ts";
import { users } from "./users-schema.ts";

type UserRepositoryOptions = { database: Database };
export type UserRepository = ReturnType<typeof userRepositoryFactory>;
export const userRepositoryFactory = ({ database }: UserRepositoryOptions) => ({
  create: async (): Promise<User> => {
    const user: User = { id: randomUUID() };
    database.insert(users).values(user).run();
    return user;
  },
});
