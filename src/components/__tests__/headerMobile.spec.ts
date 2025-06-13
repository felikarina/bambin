import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import headerMobile from "../headerMobile.vue";
import { RouterLinkStub } from "@vue/test-utils";

describe("headerMobile", () => {
  it("se monte correctement", () => {
    const wrapper = mount(headerMobile, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche les boutons principaux avec le bon texte", () => {
    const wrapper = mount(headerMobile, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const links = wrapper.findAllComponents(RouterLinkStub);
    const texts = links.map((link) => link.text());
    expect(texts).toContain("photo");
    expect(texts).toContain("activité");
  });

  it("applique les bonnes classes CSS aux boutons", () => {
    const wrapper = mount(headerMobile, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const links = wrapper.findAllComponents(RouterLinkStub);
    links.forEach((link) => {
      expect(link.classes()).toContain("mainButton");
      expect(link.classes()).toContain("button");
      expect(link.classes()).toContain("is-large");
    });
  });

  it("contient la classe .header sur le conteneur principal", () => {
    const wrapper = mount(headerMobile, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".header").exists()).toBe(true);
  });
});
