import {
  fetchUsers,
  addUserApi,
  deleteUserApi,
  fetchActivities,
  addActivityApi,
  fetchPictures,
  deletePictureApi,
  addPictureApi,
  fetchChildren,
  addChildApi,
  deleteChildApi,
  fetchSections,
  addChildSectionApi,
  fetchChildSections,
  type User,
  type Activity,
  type Picture,
  type Child,
  type Section,
  type ChildSection,
} from "../api";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("API utils", () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

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
      { idActivity: 1, date: "2024-01-01", title: "t", description: "d" },
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
    const created = { ...newActivity, idActivity: 1 };
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

  describe("Picture API", () => {
    it("fetchPictures récupère les images", async () => {
      const pictures: Picture[] = [
        {
          idPicture: "1",
          date: "2024-01-01",
          media: "image.jpg",
          title: "Photo 1",
          userId: "user1",
        },
      ];
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => pictures });
      const result = await fetchPictures();
      expect(result).toEqual(pictures);
      expect(mockFetch).toHaveBeenCalledWith("/api/pictures", {
        headers: {},
      });
    });

    it("fetchPictures gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(fetchPictures()).rejects.toThrow(
        "Erreur lors du fetch des images"
      );
    });

    it("addPictureApi ajoute une image", async () => {
      const newPicture = {
        date: "2024-01-01",
        media: "image.jpg",
        title: "Nouvelle photo",
        userId: "user1",
      };
      const created = { ...newPicture, idPicture: "1" };
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => created });
      const result = await addPictureApi(newPicture);
      expect(result).toEqual(created);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/pictures",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(newPicture),
        })
      );
    });

    it("addPictureApi gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur d'ajout" }),
      });
      await expect(addPictureApi({})).rejects.toThrow("Erreur d'ajout");
    });

    it("deletePictureApi supprime une image", async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, text: async () => "" });
      await expect(deletePictureApi("1")).resolves.toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/pictures?id=1",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    it("deletePictureApi gère une erreur API avec JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => '{"error": "Erreur de suppression"}',
      });
      await expect(deletePictureApi("1")).rejects.toThrow(
        "Erreur de suppression"
      );
    });

    it("deletePictureApi gère une erreur API sans JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => "Erreur serveur",
      });
      await expect(deletePictureApi("1")).rejects.toThrow(
        "Erreur lors de la suppression"
      );
    });
  });

  describe("Children API", () => {
    it("fetchChildren récupère les enfants", async () => {
      const children: Child[] = [
        {
          idChild: "1",
          firstname: "Jean",
          lastname: "Dupont",
          birthDate: "2020-01-01",
          userId: "user1",
        },
      ];
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => children });
      const result = await fetchChildren();
      expect(result).toEqual(children);
      expect(mockFetch).toHaveBeenCalledWith("/api/children");
    });

    it("fetchChildren retourne un tableau vide en mode demo", async () => {
      localStorage.setItem("role", "demo");
      const result = await fetchChildren();
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("fetchChildren gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(fetchChildren()).rejects.toThrow(
        "Erreur lors du fetch des enfants"
      );
    });

    it("addChildApi ajoute un enfant", async () => {
      const newChild = {
        firstname: "Marie",
        lastname: "Martin",
        birthDate: "2021-05-15",
        userId: "user1",
      };
      const created = { ...newChild, idChild: "1" };
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => created });
      const result = await addChildApi(newChild);
      expect(result).toEqual(created);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/children",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(newChild),
        })
      );
    });

    it("addChildApi gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur d'ajout enfant" }),
      });
      await expect(addChildApi({})).rejects.toThrow("Erreur d'ajout enfant");
    });

    it("deleteChildApi supprime un enfant", async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, text: async () => "" });
      await expect(deleteChildApi("1")).resolves.toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/children?id=1",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    it("deleteChildApi gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: async () => '{"error": "Erreur de suppression enfant"}',
      });
      await expect(deleteChildApi("1")).rejects.toThrow(
        "Erreur de suppression enfant"
      );
    });
  });

  describe("Sections API", () => {
    it("fetchSections récupère les sections", async () => {
      const sections: Section[] = [
        {
          idSection: "1",
          name: "Petite Section",
          year: 2024,
          numberOfChild: 15,
        },
      ];
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => sections });
      const result = await fetchSections();
      expect(result).toEqual(sections);
      expect(mockFetch).toHaveBeenCalledWith("/api/sections");
    });

    it("fetchSections retourne un tableau vide en mode demo", async () => {
      localStorage.setItem("role", "demo");
      const result = await fetchSections();
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("fetchSections gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(fetchSections()).rejects.toThrow(
        "Erreur lors du fetch des sections"
      );
    });
  });

  describe("Child Sections API", () => {
    it("addChildSectionApi ajoute une association enfant-section", async () => {
      const newChildSection = {
        childId: "child1",
        sectionName: "petit",
      };
      const created = { ...newChildSection, idChildSection: "1" };
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => created });
      const result = await addChildSectionApi(newChildSection);
      expect(result).toEqual(created);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/child-sections",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            childId: "child1",
            sectionName: "petit",
          }),
        })
      );
    });

    it("addChildSectionApi gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur d'association" }),
      });
      await expect(addChildSectionApi({})).rejects.toThrow(
        "Erreur d'association"
      );
    });

    it("fetchChildSections récupère les associations enfant-section", async () => {
      const childSections: ChildSection[] = [
        {
          idChildSection: "1",
          childId: "child1",
          sectionId: "section1",
          sectionName: "Petite Section",
        },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => childSections,
      });
      const result = await fetchChildSections();
      expect(result).toEqual(childSections);
      expect(mockFetch).toHaveBeenCalledWith("/api/child-sections");
    });

    it("fetchChildSections retourne un tableau vide en mode demo", async () => {
      localStorage.setItem("role", "demo");
      const result = await fetchChildSections();
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("fetchChildSections gère une erreur API", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(fetchChildSections()).rejects.toThrow(
        "Erreur lors du fetch des associations enfant-section"
      );
    });
  });

  describe("Headers avec rôle", () => {
    it("fetchChildren avec rôle dans localStorage", async () => {
      localStorage.setItem("role", "admin");
      const children: Child[] = [{ idChild: "1", firstname: "Test" }];
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => children });

      const result = await fetchChildren();
      expect(result).toEqual(children);
      expect(mockFetch).toHaveBeenCalledWith("/api/children", {
        headers: { "x-user-role": "admin" },
      });
    });

    it("fetchSections avec rôle dans localStorage", async () => {
      localStorage.setItem("role", "teacher");
      const sections: Section[] = [{ idSection: "1", name: "Test" }];
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => sections });

      const result = await fetchSections();
      expect(result).toEqual(sections);
      expect(mockFetch).toHaveBeenCalledWith("/api/sections", {
        headers: { "x-user-role": "teacher" },
      });
    });

    it("fetchChildSections avec rôle dans localStorage", async () => {
      localStorage.setItem("role", "parent");
      const childSections: ChildSection[] = [
        { idChildSection: "1", childId: "1" },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => childSections,
      });

      const result = await fetchChildSections();
      expect(result).toEqual(childSections);
      expect(mockFetch).toHaveBeenCalledWith("/api/child-sections", {
        headers: { "x-user-role": "parent" },
      });
    });
  });
});
