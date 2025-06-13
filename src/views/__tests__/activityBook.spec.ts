import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import activityBook from "../activityBook.vue";

describe("activityBook.vue", () => {
  it("se monte correctement et affiche les sous-composants", () => {
    const wrapper = mount(activityBook, {
      global: {
        stubs: ["NavigationSidebar", "book", "headerGallery", "headerMobile"],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: "NavigationSidebar" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "book" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "headerGallery" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "headerMobile" }).exists()).toBe(true);
  });
});
