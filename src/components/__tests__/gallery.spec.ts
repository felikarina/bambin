import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Gallery from "../gallery.vue";

describe("Gallery", () => {
  it("se monte correctement", () => {
    const wrapper = mount(Gallery);
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche plusieurs cartes d'images avec titres et hashtags", () => {
    const wrapper = mount(Gallery);
    const cards = wrapper.findAll(".card");
    expect(cards.length).toBeGreaterThan(0);
    // Vérifie la présence d'au moins un titre et un hashtag
    expect(wrapper.html()).toMatch(/card-header-title/);
    expect(wrapper.html()).toMatch(/has-text-weight-bold/);
  });

  it("affiche des images avec l'attribut alt correct", () => {
    const wrapper = mount(Gallery);
    const images = wrapper.findAll("img");
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => {
      expect(img.attributes("alt")).toBeTruthy();
    });
  });
});
