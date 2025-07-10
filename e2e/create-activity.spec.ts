import { test, expect } from "@playwright/test";

test("create an activity via the form", async ({ page, request }) => {
  // Create a user via the API
  const userData = {
    firstname: "Playwright",
    lastname: "User",
    email: `pw_${Date.now()}@example.com`,
    password: "testpass",
    role: "admin",
  };
  const res = await request.post("http://localhost:3000/api/users", {
    data: userData,
  });
  expect(res.status()).toBe(201);
  const user = await res.json();
  const userId = user.idUser;

  // Set userId and role in localStorage before page load
  await page.addInitScript((id) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("role", "admin");
  }, userId);

  // Go to the activity creation page
  await page.goto("http://localhost:3000/#/ajout-activite");

  // Fill the form
  await page.fill('input[name="titre"]', "Playwright Activity");
  await page.fill('textarea[name="description"]', "E2E test with Playwright");
  await page.fill('input[name="date"]', "2024-07-09");
  await page.selectOption('select[name="categorie"]', "Sortie");
  await page.selectOption('select[name="section"]', "petit");
  // Select a user if necessary, or fill a hidden field
  // await page.selectOption('select[name="userId"]', '...');

  // Submit the form
  await page.click('button:has-text("Créer")');

  // Check for the success modal
  await expect(page.locator(".success-modal")).toContainText(
    "Activité ajoutée au journal",
    { timeout: 10000 }
  );

  // Clean up: delete the created activity and user
  const activitiesRes = await request.get(
    "http://localhost:3000/api/activities"
  );
  expect(activitiesRes.status()).toBe(200);
  const activities = await activitiesRes.json();
  const createdActivity = activities.find(
    (a: any) => a.title === "Playwright Activity" && a.userId === userId
  );
  if (createdActivity) {
    await request.delete(
      `http://localhost:3000/api/activities?id=${createdActivity.idActivity}`
    );
  }
  await request.delete(`http://localhost:3000/api/users?id=${userId}`);
});
