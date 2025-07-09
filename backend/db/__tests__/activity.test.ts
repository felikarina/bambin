import { describe, it, expect, beforeAll } from "vitest";

const API_URL = "http://localhost:3000/api/activities";
const USER_API_URL = "http://localhost:3000/api/users";

async function createUser(userData) {
  const res = await fetch(USER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res;
}

async function createActivity(activityData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activityData),
  });
  return res;
}

async function getActivities() {
  const res = await fetch(API_URL);
  return res;
}

async function deleteActivity(id) {
  const url = `${API_URL}?id=${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return res;
}

describe("Activity API integration", () => {
  let createdActivityId: string;
  let userId: string;

  beforeAll(async () => {
    const userData = {
      firstname: "ActivityUser",
      lastname: "Test",
      email: `activityuser_${Date.now()}@example.com`,
      password: "testpass",
      role: "parent",
    };
    const res = await createUser(userData);
    expect(res.status).toBe(201);
    const user = await res.json();
    userId = user.idUser;
  });

  it("should insert an activity via API", async () => {
    const activityData = {
      date: "2024-06-01",
      title: "Test Activity",
      description: "Ceci est une activité de test.",
      category: "test",
      userId,
    };
    const res = await createActivity(activityData);
    expect(res.status).toBe(201);
    const activity = await res.json();
    expect(activity.title).toBe(activityData.title);
    createdActivityId = activity.idActivity;
  });

  it("should fetch all activities via API", async () => {
    const res = await getActivities();
    expect(res.status).toBe(200);
    const activities = await res.json();
    expect(Array.isArray(activities)).toBe(true);
  });

  it("should delete an activity via API", async () => {
    expect(createdActivityId).toBeDefined();
    const res = await deleteActivity(createdActivityId);
    expect(res.status).toBe(204);
  });

  it("should not delete an activity with missing id", async () => {
    const res = await fetch(API_URL, { method: "DELETE" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("ID utilisateur manquant");
  });
});
