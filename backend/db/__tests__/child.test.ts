import { describe, it, expect, beforeAll } from "vitest";

const API_URL = "http://localhost:3000/api/children";
const USER_API_URL = "http://localhost:3000/api/users";

async function createUser(userData) {
  const res = await fetch(USER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res;
}

async function createChild(childData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(childData),
  });
  return res;
}

async function getChildren() {
  const res = await fetch(API_URL);
  return res;
}

async function deleteChild(id) {
  const url = `${API_URL}?id=${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return res;
}

describe("Child API integration", () => {
  let createdChildId: string;
  let userId: string;

  beforeAll(async () => {
    const userData = {
      firstname: "Parent",
      lastname: "Test",
      email: `parent_${Date.now()}@example.com`,
      password: "testpass",
      role: "parent",
    };
    const res = await createUser(userData);
    expect(res.status).toBe(201);
    const user = await res.json();
    userId = user.idUser;
  });

  it("should insert a child via API", async () => {
    const childData = {
      firstname: "TestChild",
      lastname: "User",
      birthDate: "2015-01-01",
      userId,
      userId2: null,
    };
    const res = await createChild(childData);
    expect(res.status).toBe(201);
    const child = await res.json();
    expect(child.firstname).toBe(childData.firstname);
    createdChildId = child.idChild;
  });

  it("should fetch all children via API", async () => {
    const res = await getChildren();
    expect(res.status).toBe(200);
    const children = await res.json();
    expect(Array.isArray(children)).toBe(true);
  });

  it("should delete a child via API", async () => {
    expect(createdChildId).toBeDefined();
    const res = await deleteChild(createdChildId);
    expect(res.status).toBe(204);
  });

  it("should not delete a child with missing id", async () => {
    const res = await fetch(API_URL, { method: "DELETE" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("ID enfant manquant");
  });
});
