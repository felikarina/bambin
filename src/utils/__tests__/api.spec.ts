import {
  fetchUsers,
  addUserApi,
  deleteUserApi,
  fetchActivities,
  addActivityApi,
  type User,
  type Activity,
} from "../api";
import { describe, it, expect, afterEach, vi } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("API utils", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUsers récupère les utilisateurs", async () => {
    const users: User[] = [
      {
        idUser: "1",
        firstname: "A",
        lastname: "B",
        role: "admin",
        email: "a@b.com",
      },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => users });
    const result = await fetchUsers();
    expect(result).toEqual(users);
    expect(mockFetch).toHaveBeenCalledWith("/api/users");
  });

  it("addUserApi ajoute un utilisateur", async () => {
    const newUser = {
      firstname: "A",
      lastname: "B",
      email: "a@b.com",
      role: "admin",
      password: "123",
    };
    const created = { ...newUser, idUser: "1" };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => created });
    const result = await addUserApi(newUser);
    expect(result).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("deleteUserApi supprime un utilisateur", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => "" });
    await expect(deleteUserApi("1")).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/users?id=1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("fetchActivities récupère les activités", async () => {
    const activities: Activity[] = [
      { id_activity: 1, date: "2024-01-01", title: "t", description: "d" },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => activities });
    const result = await fetchActivities();
    expect(result).toEqual(activities);
    expect(mockFetch).toHaveBeenCalledWith("/api/activities");
  });

  it("addActivityApi ajoute une activité", async () => {
    const newActivity = {
      date: "2024-01-01",
      title: "t",
      description: "d",
      category: "c",
      userId: "u",
    };
    const created = { ...newActivity, id_activity: 1 };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => created });
    const result = await addActivityApi(newActivity);
    expect(result).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/activities",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("fetchUsers gère une erreur API", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchUsers()).rejects.toThrow();
  });

  it("addUserApi gère une erreur API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "err" }),
    });
    await expect(addUserApi({})).rejects.toThrow("err");
  });

  it("addActivityApi gère une erreur API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "err" }),
    });
    await expect(addActivityApi({})).rejects.toThrow("err");
  });
});
