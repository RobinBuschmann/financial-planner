import { transactionServiceFactory } from "./transaction-service-factory.ts";
import { transactionRepositoryFactory } from "./transaction-repository-factory.ts";
import { databaseFactory } from "../core/database/database-factory.ts";
import { createProviders } from "../common/inject/container.ts";
import { verifyUserIdFactory } from "../core/auth/verify-user-id.ts";
import { transactionSchemaRefFactory } from "./transactions-schema.ts";
import { transactionRoutesFactory } from "./transaction-routes-factory.ts";
import { registerRoutes } from "../core/routes/register-routes.ts";
import { registerSchema } from "../core/database/register-schema.ts";

export const transactionProviders = createProviders({
  verifyUserId: verifyUserIdFactory,
  transactionService: transactionServiceFactory,
  transactionRepository: transactionRepositoryFactory,
  database: databaseFactory,
  ...registerRoutes(transactionRoutesFactory),
  ...registerSchema(transactionSchemaRefFactory),
});
