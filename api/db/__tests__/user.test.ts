import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from "../schema";
import { eq } from "drizzle-orm";

let client: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

beforeAll(() => {
  client = postgres(process.env.DATABASE_URL!, { prepare: false });
  db = drizzle(client);
});

afterAll(async () => {
  await client.end();
});

describe("User integration", () => {
  it("should insert and fetch a user", async () => {
    // Insert
    const [inserted] = await db
      .insert(user)
      .values({
        firstname: "Test",
        lastname: "User",
        email: "testuser@example.com",
        password: "testpass",
        role: "parent",
      })
      .returning();

    // Fetch
    const users = await db
      .select()
      .from(user)
      .where(eq(user.idUser, inserted.idUser));
    expect(users.length).toBe(1);
    expect(users[0].email).toBe("testuser@example.com");
  });
});
