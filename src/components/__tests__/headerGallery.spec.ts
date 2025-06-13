import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import headerGallery from "../headerGallery.vue";

describe("headerGallery", () => {
  it("se monte correctement", () => {
    const wrapper = mount(headerGallery);
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche deux boutons avec le bon texte", () => {
    const wrapper = mount(headerGallery);
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(2);
    expect(buttons[0].text().toLowerCase()).toContain("vendredi");
    expect(buttons[1].text().toLowerCase()).toContain("calendrier");
  });

  it("applique les bonnes classes CSS aux boutons", () => {
    const wrapper = mount(headerGallery);
    const buttons = wrapper.findAll("button");
    buttons.forEach((btn) => {
      expect(btn.classes()).toContain("button");
      expect(btn.classes()).toContain("is-large");
    });
    expect(buttons[0].classes()).toContain("is-focused");
  });

  it("contient la classe .header sur le conteneur principal", () => {
    const wrapper = mount(headerGallery);
    expect(wrapper.find(".header").exists()).toBe(true);
  });
});
