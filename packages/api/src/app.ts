import { createContainer } from "./common/inject/container.ts";
import { fastifyFactory } from "./fastify-factory.ts";
import { authProviders } from "./core/auth/auth-providers.ts";
import { userProviders } from "./users/user-providers.ts";
import { transactionProviders } from "./transactions/transaction-providers.ts";
import { categoryProviders } from "./categories/category-providers.ts";
import { budgetProviders } from "./budgets/budget-providers.ts";

export const createApp = () => {
  const { fastify } = createContainer({
    fastify: fastifyFactory,
    ...authProviders,
    ...userProviders,
    ...transactionProviders,
    ...categoryProviders,
    ...budgetProviders,
  });
  return fastify.create();
};
