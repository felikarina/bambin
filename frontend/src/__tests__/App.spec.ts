import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import App from "../App.vue";

describe("App.vue", () => {
  it("se monte correctement et contient un router-view", () => {
    const wrapper = mount(App, {
      global: { stubs: ["router-view"] },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: "router-view" }).exists()).toBe(true);
  });
});
