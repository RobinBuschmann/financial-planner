import { z } from "zod";
import { FormValidateFn } from "@tanstack/form-core";

export const zodValidator =
  (schema: z.ZodSchema) =>
  <T>(...[{ value }]: Parameters<FormValidateFn<T>>) => {
    const { error } = schema.safeParse(value);
    if (error) {
      return {
        fields: Object.fromEntries(
          error.issues.map((issue) => [issue.path.join(""), issue.message]),
        ),
      };
    }
  };
