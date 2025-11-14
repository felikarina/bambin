import { describe, it, expect, vi } from "vitest";
import router, { authGuard } from "../index";

// mock fetch for /api/current-user
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ role: null }),
  } as any)
) as any;

describe("router/index.ts", () => {
  it("contient toutes les routes attendues", () => {
    const routeNames = router.getRoutes().map((r) => r.name);
    expect(routeNames).toContain("Login");
    expect(routeNames).toContain("PhotoGallery");
    expect(routeNames).toContain("activityBook");
  });

  it("redirige vers / si non authentifié sur une route protégée", async () => {
    (fetch as any).mockReturnValueOnce(
      Promise.resolve({ ok: true, json: () => Promise.resolve({ role: null }) })
    );
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/");
  });

  it("laisse passer si authentifié et rôle correct", async () => {
    (fetch as any).mockImplementation((url: string) => {
      if (url === "/api/current-user")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "admin" }),
        });
      return Promise.resolve({ ok: false });
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("redirige si le rôle ne correspond pas", async () => {
    (fetch as any).mockImplementation((url: string) => {
      if (url === "/api/current-user")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "user" }),
        });
      return Promise.resolve({ ok: false });
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: "admin" } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/");
  });

  it("redirige si le rôle n'est pas dans le tableau des rôles autorisés", async () => {
    (fetch as any).mockImplementation((url: string) => {
      if (url === "/api/current-user")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "user" }),
        });
      return Promise.resolve({ ok: false });
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: ["admin", "superadmin"] } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith("/");
  });

  it("laisse passer si le rôle est dans le tableau des rôles autorisés", async () => {
    (fetch as any).mockImplementation((url: string) => {
      if (url === "/api/current-user")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "admin" }),
        });
      return Promise.resolve({ ok: false });
    });
    const next = vi.fn();
    const to = { meta: { requiresAuth: true, role: ["admin", "superadmin"] } };
    const from = {};
    await authGuard(to, from, next);
    expect(next).toHaveBeenCalledWith();
  });
});
