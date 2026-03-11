import { SQLiteTable } from "drizzle-orm/sqlite-core";

export type SchemaRef = {
  [schemaName: string]: SQLiteTable;
};
