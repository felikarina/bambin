import { describe, it, expect, vi } from "vitest";
import router, { authGuard } from "../index";

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as any;

describe("router/index.ts", () => {
  it("contient toutes les routes attendues", () => {
    const routeNames = router.getRoutes().map((r) => r.name);
    expect(routeNames).toContain("Acceuil");
    expect(routeNames).toContain("Login");
    expect(routeNames).toContain("PhotoGallery");
    expect(routeNames).toContain("activityBook");
  });

  it("redirige vers /connexion si non authentifié sur une route protégée", async () => {
    (localStorage.getItem as any).mockReturnValueOnce(null); // Pas de token
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/connexion");
  });

  it("laisse passer si authentifié et rôle correct", async () => {
    (localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "token") return "abc";
      if (key === "role") return "admin";
      return null;
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("redirige si le rôle ne correspond pas", async () => {
    (localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "token") return "abc";
      if (key === "role") return "user";
      return null;
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/connexion");
  });

  it("redirige si le rôle n'est pas dans le tableau des rôles autorisés", async () => {
    (localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "token") return "abc";
      if (key === "role") return "user";
      return null;
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: ["admin", "superadmin"] } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/connexion");
  });

  it("laisse passer si le rôle est dans le tableau des rôles autorisés", async () => {
    (localStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "token") return "abc";
      if (key === "role") return "admin";
      return null;
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: ["admin", "superadmin"] } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith();
  });
});
