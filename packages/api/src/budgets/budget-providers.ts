import { budgetServiceFactory } from "./budget-service-factory.ts";
import { budgetRepositoryFactory } from "./budget-repository-factory.ts";
import { createProviders } from "../common/inject/container.ts";
import { registerRoutes } from "../core/routes/register-routes.ts";
import { registerSchema } from "../core/database/register-schema.ts";
import { verifyUserIdFactory } from "../core/auth/verify-user-id.ts";
import { budgetSchemaRefFactory } from "./budget-database-schema.ts";
import { budgetRoutesFactory } from "./budget-routes-factory.ts";
import { databaseFactory } from "../core/database/database-factory.js";

export const budgetProviders = createProviders({
  verifyUserId: verifyUserIdFactory,
  budgetService: budgetServiceFactory,
  budgetRepository: budgetRepositoryFactory,
  database: databaseFactory,
  ...registerRoutes(budgetRoutesFactory),
  ...registerSchema(budgetSchemaRefFactory),
});
