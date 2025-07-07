import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, child } from "./schema";
import { seed } from "drizzle-seed";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);
  await seed(db, { user, child });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
