import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import {
  fetchActivities,
  addActivityApi,
  deleteActivityApi,
  type Activity,
  getDemoRoleHeader,
} from "../api";

describe("api.ts - Activities", () => {
  let fetchSpy: any;
  const mockActivities: Activity[] = [
    { idActivity: 1, title: "A", date: "2024-01-01", userId: "u1" },
    { idActivity: 2, title: "B", date: "2024-01-02", userId: "u2" },
  ];

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
  });

  it("fetchActivities retourne les activités si ok", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    } as any);
    const result = await fetchActivities();
    expect(result).toEqual(mockActivities);
  });

  it("fetchActivities lève une erreur si !ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: false } as any);
    await expect(fetchActivities()).rejects.toThrow(
      "Erreur lors du fetch des activités"
    );
  });

  it("addActivityApi fait un fetch POST et retourne la réponse JSON si ok", async () => {
    const newActivity = { title: "Nouvelle activité" };
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
    const result = await addActivityApi(newActivity);
    expect(result).toEqual({ success: true });
  });

  it("addActivityApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Ajout impossible" }),
    } as any);
    await expect(addActivityApi({})).rejects.toThrow("Ajout impossible");
  });

  it("addActivityApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any);
    await expect(addActivityApi({})).rejects.toThrow(
      "Erreur lors de l'ajout de l'activité"
    );
  });

  it("deleteActivityApi fait un fetch DELETE et ne retourne rien si ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: true } as any);
    await expect(deleteActivityApi("1")).resolves.toBeUndefined();
  });

  it("deleteActivityApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: "Suppression impossible" }),
    } as any);
    await expect(deleteActivityApi("1")).rejects.toThrow(
      "Suppression impossible"
    );
  });

  it("deleteActivityApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => "",
    } as any);
    await expect(deleteActivityApi("1")).rejects.toThrow(
      "Erreur lors de la suppression"
    );
  });

  describe("getDemoRoleHeader", () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it("retourne un header avec le role si présent", () => {
      window.localStorage.setItem("role", "admin");
      expect(getDemoRoleHeader()).toEqual({ "x-user-role": "admin" });
    });

    it("retourne un header vide si pas de role", () => {
      expect(getDemoRoleHeader()).toEqual({});
    });
  });
});
