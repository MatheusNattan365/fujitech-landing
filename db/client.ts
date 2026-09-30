import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pg?: ReturnType<typeof postgres>;
  db?: PostgresJsDatabase<typeof schema>;
};

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não configurada");
  }
  if (!globalForDb.pg) {
    globalForDb.pg = postgres(url, { max: 10 });
  }
  return globalForDb.pg;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getClient(), { schema });
  }
  return globalForDb.db;
}

export async function closeDb() {
  await globalForDb.pg?.end({ timeout: 5 });
  globalForDb.pg = undefined;
  globalForDb.db = undefined;
}

export type Database = ReturnType<typeof getDb>;
