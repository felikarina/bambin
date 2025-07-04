import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Gallery from "../gallery.vue";

describe("Gallery", () => {
  it("se monte correctement", () => {
    const wrapper = mount(Gallery);
    expect(wrapper.exists()).toBe(true);
  });
});
