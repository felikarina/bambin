import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import * as relations from "../db/relations";

const isProduction = !!process.env.VERCEL;
const isTest = process.env.NODE_ENV === "test";

const connectionString = isProduction
  ? process.env.SUPABASE_STRING_URL!
  : isTest
    ? process.env.DATABASE_URL_TEST!
    : process.env.LOCAL_DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema: { ...schema, ...relations } });
