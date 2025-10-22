import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { fetchUsers, addUserApi, deleteUserApi, type User } from "../api";

const mockUsers: User[] = [
  {
    idUser: "1",
    firstname: "A",
    lastname: "B",
    role: "admin",
    email: "a@b.com",
  },
  {
    idUser: "2",
    firstname: "C",
    lastname: "D",
    role: "demo",
    email: "c@d.com",
  },
];

describe("api.ts - Users", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch");
    try {
      window.localStorage.clear();
    } catch (e) {}
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
  });

  it("fetchUsers retourne [] si role demo", async () => {
    // simulate server returning empty array when demo
    fetchSpy.mockResolvedValueOnce({ ok: true, json: async () => [] } as any);
    const result = await fetchUsers();
    expect(result).toEqual([]);
    expect(fetchSpy).toHaveBeenCalledWith("/api/users", {
      credentials: "include",
    });
  });

  it("fetchUsers retourne les users si ok", async () => {
    // Use a mock JWT token for testing
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.test-signature";
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as any);
    const result = await fetchUsers();
    expect(fetchSpy).toHaveBeenCalledWith("/api/users", {
      credentials: "include",
    });
    expect(result).toEqual(mockUsers);
  });

  it("fetchUsers retourne les users si pas de role", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as any);
    const result = await fetchUsers();
    expect(fetchSpy).toHaveBeenCalledWith("/api/users", {
      credentials: "include",
    });
    expect(result).toEqual(mockUsers);
  });

  it("fetchUsers lève une erreur si !ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: false } as any);
    await expect(fetchUsers()).rejects.toThrow(
      "Erreur lors du fetch des utilisateurs"
    );
  });

  it("addUserApi fait un fetch POST et retourne la réponse JSON si ok", async () => {
    const newUser = { firstname: "Test" };
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
    const result = await addUserApi(newUser);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newUser),
      })
    );
    expect(result).toEqual({ success: true });
  });

  it("addUserApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Ajout impossible" }),
    } as any);
    await expect(addUserApi({})).rejects.toThrow("Ajout impossible");
  });

  it("addUserApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any);
    await expect(addUserApi({})).rejects.toThrow("Erreur lors de l'ajout");
  });

  it("deleteUserApi fait un fetch DELETE et ne retourne rien si ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: true } as any);
    await expect(deleteUserApi("1")).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledWith("/api/users?id=1", {
      method: "DELETE",
      credentials: "include",
    });
  });

  it("deleteUserApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: "Suppression impossible" }),
    } as any);
    await expect(deleteUserApi("1")).rejects.toThrow("Suppression impossible");
  });

  it("deleteUserApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => "",
    } as any);
    await expect(deleteUserApi("1")).rejects.toThrow(
      "Erreur lors de la suppression"
    );
  });
});
