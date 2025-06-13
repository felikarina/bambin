import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import NavigationSidebar from "../NavigationSidebar.vue";
import { RouterLinkStub } from "@vue/test-utils";

describe("NavigationSidebar", () => {
  it("devrait se monter correctement", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche tous les liens de navigation attendus", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const links = wrapper.findAllComponents(RouterLinkStub);
    const texts = links.map((link) => link.text());
    expect(texts).toContain("Galerie photo");
    expect(texts).toContain("Journal d'activité");
    expect(texts).toContain("Déconnexion");
  });

  it("affiche les icônes appropriées pour chaque bouton", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".fa-image").exists()).toBe(true);
    expect(wrapper.find(".fa-pen-to-square").exists()).toBe(true);
    expect(wrapper.find(".fa-power-off").exists()).toBe(true);
  });

  it("respecte la structure HTML attendue", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.findAll("ul").length).toBe(2);
    expect(wrapper.findAll("li").length).toBe(4); // 2 liens principaux + déconnexion
  });

  it("contient la classe Bulma .box", () => {
    const wrapper = mount(NavigationSidebar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".box").exists()).toBe(true);
  });
});
