import type { Config } from "drizzle-kit";

export default {
  schema: ["./backend/db/schema.ts"],
  out: "../backend/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL!,
  },
} satisfies Config;
