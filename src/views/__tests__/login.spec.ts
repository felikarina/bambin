import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import login from "../login.vue";

describe("login.vue", () => {
  it("se monte correctement et affiche le formulaire", () => {
    const wrapper = mount(login);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("affiche un message d'erreur si les identifiants sont invalides", async () => {
    // Mock fetch pour retourner une erreur
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Erreur" }),
    });
    const wrapper = mount(login);
    // Remplir les champs
    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("wrong");
    // Cliquer sur le bouton de connexion
    await wrapper.find("button").trigger("click");
    // Attendre le DOM update
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Erreur");
  });
});
