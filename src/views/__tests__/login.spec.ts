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
    global.fetch = vi.fn().mockResolvedValue({
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
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok", role: "admin" }),
    });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("admin@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/administration");
  });

  it("connecte et redirige le parent vers /galerie-photo", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok", role: "parent" }),
    });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("parent@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/galerie-photo");
  });

  it("connecte et redirige nurseryStaff vers /ajout-activite", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok", role: "nurseryStaff" }),
    });
    const wrapper = mount(login);
    await wrapper.find('input[type="email"]').setValue("staff@test.com");
    await wrapper.find('input[type="password"]').setValue("test");
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/ajout-activite");
  });

  it("bouton démo connecte et redirige vers /galerie-photo", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok", role: "parent" }),
    });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(push).toHaveBeenCalledWith("/galerie-photo");
  });

  it("affiche une erreur si la connexion démo échoue", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Erreur démo" }),
    });
    const wrapper = mount(login);
    await wrapper.findAll("button")[1].trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur démo");
  });

  it("ne redirige pas si le rôle est inconnu", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok", role: "autre" }),
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
    // Vérifie que le champ mot de passe a le focus
    expect(document.activeElement).toBe(passwordInput.element);
  });
});
