import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Gallery from "../gallery.vue";
import * as api from "../../utils/api";

// Mock v-lazy directive
const globalDirectives = { lazy: { mounted: () => {}, updated: () => {} } };

describe("Gallery", () => {
  const mockPictures = [
    {
      idPicture: "1",
      date: "2024-01-02",
      media: "img1.jpg",
      title: "Titre 1",
      children: [
        { idChild: "c1", firstname: "Jean", lastname: "Dupont" },
        { idChild: "c2", firstname: "Léa", lastname: "Martin" },
      ],
    },
    {
      idPicture: "2",
      date: "2024-01-01",
      media: "img2.jpg",
      title: "Titre 2",
      children: [],
    },
  ];
  const mockChildren = [
    { idChild: "c1", firstname: "Jean", lastname: "Dupont", userId: "parent1" },
    { idChild: "c2", firstname: "Léa", lastname: "Martin", userId: "parent2" },
  ];

  let fetchPicturesSpy: any;
  let fetchChildrenSpy: any;
  let getItemSpy: any;

  beforeEach(() => {
    fetchPicturesSpy = vi
      .spyOn(api, "fetchPictures")
      .mockResolvedValue(mockPictures);
    fetchChildrenSpy = vi
      .spyOn(api, "fetchChildren")
      .mockResolvedValue(mockChildren);
    getItemSpy = vi.spyOn(window.localStorage.__proto__, "getItem");
    vi.spyOn(window.localStorage.__proto__, "setItem");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mounts and displays all pictures sorted by date desc", async () => {
    getItemSpy.mockImplementation((key: string) => {
      if (key === "role") return "admin";
      if (key === "userId") return "parent1";
      return null;
    });
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    const cards = wrapper.findAll(".card");
    expect(cards.length).toBe(2);
    // First card is the most recent
    expect(cards[0].text()).toContain("Titre 1");
    expect(cards[1].text()).toContain("Titre 2");
  });

  it("displays children tags if picture has children", async () => {
    getItemSpy.mockReturnValue("admin");
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    const tags = wrapper.findAll(".child-name-tag");
    expect(tags.length).toBe(2);
    expect(tags[0].text()).toContain("Jean Dupont");
    expect(tags[1].text()).toContain("Léa Martin");
  });

  it("filters pictures for parent role to only show their children", async () => {
    getItemSpy.mockImplementation((key: string) => {
      if (key === "role") return "parent";
      if (key === "userId") return "parent1";
      return null;
    });
    // Picture 1 has child c1 (parent1), Picture 2 has no children
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    const cards = wrapper.findAll(".card");
    // Picture 1 (child c1) and Picture 2 (no children) should be shown
    expect(cards.length).toBe(2);
    expect(cards[0].text()).toContain("Titre 1");
    expect(cards[1].text()).toContain("Titre 2");
  });

  it("filters out pictures for parent if no children match", async () => {
    getItemSpy.mockImplementation((key: string) => {
      if (key === "role") return "parent";
      if (key === "userId") return "parentX";
      return null;
    });
    fetchPicturesSpy.mockResolvedValueOnce([
      {
        idPicture: "1",
        date: "2024-01-02",
        media: "img1.jpg",
        title: "Titre 1",
        children: [],
      },
      {
        idPicture: "2",
        date: "2024-01-01",
        media: "img2.jpg",
        title: "Titre 2",
        children: [],
      },
    ]);
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    // Only pictures with no children should be shown
    const cards = wrapper.findAll(".card");
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card.find(".children-list").exists()).toBe(false);
    }
  });

  it("handles fetchPictures error gracefully", async () => {
    fetchPicturesSpy.mockRejectedValueOnce(new Error("fail"));
    getItemSpy.mockReturnValue("admin");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    expect(errorSpy).toHaveBeenCalledWith("Error fetching pictures:", "fail");
    errorSpy.mockRestore();
  });

  it("shows no cards if no pictures are returned", async () => {
    fetchPicturesSpy.mockResolvedValueOnce([]);
    getItemSpy.mockReturnValue("admin");
    const wrapper = mount(Gallery, {
      global: { directives: globalDirectives },
    });
    await flushPromises();
    expect(wrapper.findAll(".card").length).toBe(0);
  });
});
