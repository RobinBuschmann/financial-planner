import { multi } from "../../common/inject/container.ts";
import type { RequestDecorator } from "./request-decorator.ts";

export const registerRequestDecorator = <TContainer>(
  factory: (container: TContainer) => RequestDecorator,
) => multi("requestDecorators", factory);
