import type { Config } from "drizzle-kit";

export default {
  schema: ["./api/db/schema.ts"],
  out: "../api/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL!,
  },
} satisfies Config;
