import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, child } from "../schema";
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

beforeEach(async () => {
  // Clean up the user table before each test to ensure isolation
  await db.delete(child);
  await db.delete(user);
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

  it("should update a user's firstname", async () => {
    // Insert a user
    const [inserted] = await db
      .insert(user)
      .values({
        firstname: "ToUpdate",
        lastname: "User",
        email: "update@example.com",
        password: "testpass",
        role: "parent",
      })
      .returning();

    // Update the user's firstname
    await db
      .update(user)
      .set({ firstname: "Updated" })
      .where(eq(user.idUser, inserted.idUser));

    // Fetch the updated user and check the firstname
    const [updated] = await db
      .select()
      .from(user)
      .where(eq(user.idUser, inserted.idUser));
    expect(updated.firstname).toBe("Updated");
  });

  it("should delete a user", async () => {
    // Insert a user
    const [inserted] = await db
      .insert(user)
      .values({
        firstname: "ToDelete",
        lastname: "User",
        email: "delete@example.com",
        password: "testpass",
        role: "parent",
      })
      .returning();

    // Delete the user
    await db.delete(user).where(eq(user.idUser, inserted.idUser));
    // Try to fetch the deleted user
    const users = await db
      .select()
      .from(user)
      .where(eq(user.idUser, inserted.idUser));
    expect(users.length).toBe(0);
  });

  it("should fetch all users", async () => {
    // Insert multiple users
    await db.insert(user).values([
      {
        firstname: "A",
        lastname: "A",
        email: "a@example.com",
        password: "a",
        role: "parent",
      },
      {
        firstname: "B",
        lastname: "B",
        email: "b@example.com",
        password: "b",
        role: "parent",
      },
    ]);
    // Fetch all users
    const users = await db.select().from(user);
    expect(users.length).toBe(2);
  });
});
