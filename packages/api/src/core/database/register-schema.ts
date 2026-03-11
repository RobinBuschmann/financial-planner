import { multi } from "../../common/inject/container.ts";
import type { SchemaRef } from "./schema-ref.ts";

export const registerSchema = <TContainer>(
  factory: (container: TContainer) => SchemaRef,
) => multi("schemas", factory);
