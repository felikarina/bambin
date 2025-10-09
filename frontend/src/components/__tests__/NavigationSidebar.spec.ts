import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import NavigationSidebar from "../NavigationSidebar.vue";
import { RouterLinkStub } from "@vue/test-utils";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

describe("NavigationSidebar", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("devrait se monter correctement", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche tous les liens de navigation attendus sans admin", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const links = wrapper.findAllComponents(RouterLinkStub);
    const texts = links.map((link) => link.text());
    expect(texts).toContain("Galerie photo");
    expect(texts).toContain("Journal d'activité");
    expect(texts).toContain("Déconnexion");
    expect(texts).not.toContain("Administration");
  });

  it("affiche le lien Administration seulement pour l'admin", async () => {
    localStorage.setItem(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.signature"
    );
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    await flushPromises();
    const links = wrapper.findAllComponents(RouterLinkStub);
    const texts = links.map((link) => link.text());
    expect(texts).toContain("Administration");
  });

  it("affiche les icônes appropriées pour chaque bouton", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".fa-image").exists()).toBe(true);
    expect(wrapper.find(".fa-pen-to-square").exists()).toBe(true);
    expect(wrapper.find(".fa-power-off").exists()).toBe(true);
  });

  it("respecte la structure HTML attendue sans admin", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.findAll("ul").length).toBe(2);
    expect(wrapper.findAll("li").length).toBe(3);
  });

  it("respecte la structure HTML attendue avec admin", async () => {
    localStorage.setItem(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.signature"
    );
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    await flushPromises();
    expect(wrapper.findAll("ul").length).toBe(2);
    expect(wrapper.findAll("li").length).toBe(6);
  });

  it("contient la classe Bulma .box", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".box").exists()).toBe(true);
  });
});
