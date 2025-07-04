import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PhotoGallery from "../PhotoGallery.vue";

describe("PhotoGallery.vue", () => {
  it("se monte correctement et affiche les sous-composants", () => {
    const wrapper = mount(PhotoGallery, {
      global: {
        stubs: [
          "NavigationSidebar",
          "gallery",
          "headerGallery",
          "headerMobile",
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: "NavigationSidebar" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "gallery" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "headerGallery" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "headerMobile" }).exists()).toBe(true);
  });
});
