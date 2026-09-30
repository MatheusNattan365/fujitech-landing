import { defineConfig } from "drizzle-kit";
import { loadEnv } from "./db/load-env";

loadEnv();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://fujitech:fujitech@localhost:5432/fujitech",
  },
});
