import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HelloWorld from "../HelloWorld.vue";
import { RouterLinkStub } from "@vue/test-utils";

vi.mock("vue-router", () => ({
  useRoute: () => ({ path: "/galerie-photo" }),
}));

describe("HelloWorld", () => {
  it("se monte correctement", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("affiche les onglets de navigation avec le bon texte", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const links = wrapper.findAllComponents(RouterLinkStub);
    const texts = links.map((link) => link.text());
    expect(texts).toContain("Galerie photo");
    expect(texts).toContain("Journal d'activité");
    expect(texts).toContain("connexion");
  });

  it("affiche la carte avec l'image et le titre", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".card-header-title").text().toLowerCase()).toContain(
      "chat poulpe"
    );
    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("affiche le texte 'Hello world.' dans la carte", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Test" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.find(".card-content .content").text()).toContain(
      "Hello world."
    );
  });
});
