import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, child } from "./schema";
import { seed } from "drizzle-seed";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);
  await seed(db, { user, child });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
