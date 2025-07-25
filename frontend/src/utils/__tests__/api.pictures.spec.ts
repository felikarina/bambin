import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import {
  fetchPictures,
  deletePictureApi,
  addPictureApi,
  type Picture,
  addPictureTagsApi,
} from "../api";

const mockPictures: Picture[] = [
  {
    idPicture: "1",
    date: "2024-01-01",
    media: "img1.jpg",
    title: "Titre 1",
    userId: "u1",
  },
  {
    idPicture: "2",
    date: "2024-01-02",
    media: "img2.jpg",
    title: "Titre 2",
    userId: "u2",
  },
];

describe("api.ts - Pictures", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
  });

  it("fetchPictures retourne les images si ok", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPictures,
    } as any);
    const result = await fetchPictures();
    expect(fetchSpy).toHaveBeenCalledWith("/api/pictures", { headers: {} });
    expect(result).toEqual(mockPictures);
  });

  it("fetchPictures lève une erreur si !ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: false } as any);
    await expect(fetchPictures()).rejects.toThrow(
      "Erreur lors du fetch des images"
    );
  });

  it("deletePictureApi fait un fetch DELETE et ne retourne rien si ok", async () => {
    fetchSpy.mockResolvedValueOnce({ ok: true } as any);
    await expect(deletePictureApi("1")).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledWith("/api/pictures?id=1", {
      method: "DELETE",
      headers: {},
    });
  });

  it("deletePictureApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: "Suppression impossible" }),
    } as any);
    await expect(deletePictureApi("1")).rejects.toThrow(
      "Suppression impossible"
    );
  });

  it("deletePictureApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      text: async () => "",
    } as any);
    await expect(deletePictureApi("1")).rejects.toThrow(
      "Erreur lors de la suppression"
    );
  });

  it("addPictureApi fait un fetch POST et retourne la réponse JSON si ok", async () => {
    const newPic = { title: "Nouvelle photo" };
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
    const result = await addPictureApi(newPic);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/pictures",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(newPic),
      })
    );
    expect(result).toEqual({ success: true });
  });

  it("addPictureApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Ajout impossible" }),
    } as any);
    await expect(addPictureApi({})).rejects.toThrow("Ajout impossible");
  });

  it("addPictureApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any);
    await expect(addPictureApi({})).rejects.toThrow(
      "Erreur lors de l'ajout de la photo"
    );
  });

  it("addPictureTagsApi fait un fetch POST et retourne la réponse JSON si ok", async () => {
    const idPicture = "1";
    const childIds = ["c1", "c2"];
    const response = { success: true };
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => response,
    } as any);
    const result = await addPictureTagsApi(idPicture, childIds);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/picture-tags",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ idPicture, childIds }),
      })
    );
    expect(result).toEqual(response);
  });

  it("addPictureTagsApi lève une erreur si !ok avec message d'erreur JSON", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur d'association" }),
    } as any);
    await expect(addPictureTagsApi("1", ["c1"])).rejects.toThrow(
      "Erreur d'association"
    );
  });

  it("addPictureTagsApi lève une erreur générique si !ok sans message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any);
    await expect(addPictureTagsApi("1", ["c1"])).rejects.toThrow(
      "Error while creating picture tags"
    );
  });
});
