import { categoryServiceFactory } from "./category-service-factory.ts";
import { categoryRepositoryFactory } from "./category-repository-factory.ts";
import { createProviders } from "../common/inject/container.ts";
import { registerRoutes } from "../core/routes/register-routes.ts";
import { registerSchema } from "../core/database/register-schema.ts";
import { verifyUserIdFactory } from "../core/auth/verify-user-id.ts";
import { categorySchemaRefFactory } from "./category-database-schema.ts";
import { categoryRoutesFactory } from "./category-routes-factory.ts";
import { databaseFactory } from "../core/database/database-factory.js";

export const categoryProviders = createProviders({
  verifyUserId: verifyUserIdFactory,
  categoryService: categoryServiceFactory,
  categoryRepository: categoryRepositoryFactory,
  database: databaseFactory,
  ...registerRoutes(categoryRoutesFactory),
  ...registerSchema(categorySchemaRefFactory),
});
