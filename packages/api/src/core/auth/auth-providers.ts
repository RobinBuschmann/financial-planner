import { createProviders } from "../../common/inject/container.ts";
import { registerRequestDecorator } from "../routes/register-request-decorator.ts";
import {
  userIdDecoratorFactory,
  verifyUserIdFactory,
} from "./verify-user-id.ts";

export const authProviders = createProviders({
  verifyUserId: verifyUserIdFactory,
  ...registerRequestDecorator(userIdDecoratorFactory),
});
