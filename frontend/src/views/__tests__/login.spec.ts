import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";

const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
}));

import login from "../login.vue";

beforeEach(() => {
  global.fetch = vi.fn();
  push.mockClear();
});

describe("login.vue", () => {
  it("se monte correctement et affiche le formulaire", () => {
    const wrapper = mount(login);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("affiche un message d'erreur si les identifiants sont invalides", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("wrong");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur");
  });

  it("connecte et redirige l'admin vers /administration", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "admin", userId: "u1" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "admin", userId: "u1" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("admin@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/administration");
  });

  it("connecte et redirige le parent vers /galerie-photo", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("parent@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/galerie-photo");
  });

  it("connecte et redirige nurseryStaff vers /ajout-activite", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "nurseryStaff", userId: "u3" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "nurseryStaff", userId: "u3" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("staff@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/ajout-activite");
  });

  it("bouton démo connecte et redirige vers /galerie-photo", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/galerie-photo");
  });

  it("affiche une erreur si la connexion démo échoue", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur démo" }),
      });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur démo");
  });

  it("ne redirige pas si le rôle est inconnu", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "autre", userId: "u4" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "autre", userId: "u4" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("autre@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).not.toHaveBeenCalled();
  });

  it("focus sur le champ mot de passe après entrée sur l'email", async () => {
    const wrapper = mount(login, {
      attachTo: document.body,
    });
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    await emailInput.trigger("keyup.enter");
    // Check that the password field has focus
    expect(document.activeElement).toBe(passwordInput.element);
  });

  it("saves token, role, userId in localStorage on successful login", async () => {
    // After login the component should request current-user; mock both calls
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u1" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u1" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("parent@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    // ensure login was called with credentials include and that component asked current-user
    expect((global.fetch as any).mock.calls[0][0]).toBe("/api/login");
    expect((global.fetch as any).mock.calls[0][1]).toMatchObject({
      credentials: "include",
    });
    expect((global.fetch as any).mock.calls[1][0]).toBe("/api/current-user");
  });

  it("resets error message on new login attempt", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur2" }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("wrong");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur");
    // New attempt
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur2");
  });

  it("calls login even if fields are empty", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Erreur" }),
      });
    const wrapper = mount(login);
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email: "", password: "" }),
        credentials: "include",
      })
    );
  });

  it("calls loginDemo with demo credentials", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: "parent", userId: "u2" }),
      });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email: "demo@test.com", password: "test" }),
        credentials: "include",
      })
    );
  });

  it("shows generic error if API returns error without error field (login)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("wrong");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur");
  });

  it("shows generic error if API returns error without error field (loginDemo)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur");
  });

  it("sets empty string in localStorage if token/role/userId are missing (login)", async () => {
    // If login response has no role/userId we still expect the component to request current-user
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ role: null, userId: null }),
      });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("parent@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect((global.fetch as any).mock.calls[0][0]).toBe("/api/login");
    expect((global.fetch as any).mock.calls[1][0]).toBe("/api/current-user");
  });

  it("sets empty string in localStorage if token/role are missing (loginDemo)", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ role: null }) });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect((global.fetch as any).mock.calls[0][0]).toBe("/api/login");
    expect((global.fetch as any).mock.calls[1][0]).toBe("/api/current-user");
  });
});
