import Sqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { SchemaRef } from "./schema-ref.ts";

type DatabaseOptions = {
  schemas: SchemaRef[];
};
export type Database = ReturnType<typeof databaseFactory>;
export const databaseFactory = ({ schemas }: DatabaseOptions) => {
  const client = new Sqlite3("./financial-planner.db");
  client.pragma("foreign_keys = ON");
  return drizzle({
    client,
    schema: schemas.reduce((acc, schema) => ({ ...acc, ...schema }), {}),
  });
};
