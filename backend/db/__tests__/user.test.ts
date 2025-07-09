import { describe, it, expect } from "vitest";

const API_URL = "http://localhost:3000/api/users";

async function createUser(userData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res;
}

async function getUsers() {
  const res = await fetch(API_URL);
  return res;
}

async function deleteUser(id) {
  const url = `${API_URL}?id=${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return res;
}

describe("User API integration", () => {
  let createdUserId: string;

  it("should insert a user via API", async () => {
    const userData = {
      firstname: "Test",
      lastname: "User",
      email: `testuser_${Date.now()}@example.com`,
      password: "testpass",
      role: "parent",
    };
    const res = await createUser(userData);
    expect(res.status).toBe(201);
    const user = await res.json();
    expect(user.email).toBe(userData.email);
    createdUserId = user.idUser;
  });

  it("should fetch all users via API", async () => {
    const res = await getUsers();
    expect(res.status).toBe(200);
    const users = await res.json();
    expect(Array.isArray(users)).toBe(true);
  });

  it("should delete a user via API", async () => {
    expect(createdUserId).toBeDefined();
    const res = await deleteUser(createdUserId);
    expect(res.status).toBe(204);
  });

  it("should not delete a user with missing id", async () => {
    const res = await fetch(API_URL, { method: "DELETE" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("ID utilisateur manquant");
  });
});
