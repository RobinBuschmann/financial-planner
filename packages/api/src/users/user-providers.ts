import { createProviders } from "../common/inject/container.ts";
import { registerRoutes } from "../core/routes/register-routes.ts";
import { registerSchema } from "../core/database/register-schema.ts";
import { userRoutesFactory } from "./user-routes-factory.ts";
import { userRepositoryFactory } from "./user-repository-factory.ts";
import { userServiceFactory } from "./user-service-factory.ts";
import { userSchemaRefFactory } from "./users-schema.ts";
import { databaseFactory } from "../core/database/database-factory.js";

export const userProviders = createProviders({
  userService: userServiceFactory,
  userRepository: userRepositoryFactory,
  database: databaseFactory,
  ...registerRoutes(userRoutesFactory),
  ...registerSchema(userSchemaRefFactory),
});
