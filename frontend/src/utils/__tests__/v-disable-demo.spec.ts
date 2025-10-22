import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import disableDemo from "../v-disable-demo";

function createElement(type = "button") {
  let el: HTMLElement;
  switch (type) {
    case "button":
      el = document.createElement("button") as HTMLButtonElement;
      break;
    case "input":
      el = document.createElement("input") as HTMLInputElement;
      break;
    case "select":
      el = document.createElement("select") as HTMLSelectElement;
      break;
    case "textarea":
      el = document.createElement("textarea") as HTMLTextAreaElement;
      break;
    default:
      el = document.createElement(type);
  }
  document.body.appendChild(el);
  return el;
}

describe("disableDemo directive", () => {
  let originalGetItem: typeof window.localStorage.getItem;

  // mock fetch globally
  const originalFetch = global.fetch;

  beforeEach(() => {
    // reset mock
    (global.fetch as any) = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ role: null }) })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    document.body.innerHTML = "";
  });

  it("should disable element if role is demo (mounted)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = createElement("button") as HTMLButtonElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should not disable element if role is not demo (mounted)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "admin" }),
      })
    );
    const el = createElement("button") as HTMLButtonElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should disable element if role is demo (updated)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = createElement("button") as HTMLButtonElement;
    await (disableDemo as any).updated(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should enable element if role is not demo (updated)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "admin" }),
      })
    );
    const el = createElement("button") as HTMLButtonElement;
    el.disabled = true;
    await (disableDemo as any).updated(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should set attributes for non-form elements (demo)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = createElement("div");
    await (disableDemo as any).updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBe("true");
    expect(el.style.pointerEvents).toBe("none");
    expect(el.style.userSelect).toBe("none");
    expect(el.style.opacity).toBe("0.7");
  });

  it("should remove attributes for non-form elements (not demo)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "admin" }),
      })
    );
    const el = createElement("div");
    el.setAttribute("data-demo-disabled", "true");
    el.style.pointerEvents = "none";
    el.style.userSelect = "none";
    el.style.opacity = "0.7";
    await (disableDemo as any).updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBeNull();
    expect(el.style.pointerEvents).toBe("");
    expect(el.style.userSelect).toBe("");
    expect(el.style.opacity).toBe("");
  });

  it("should set readOnly for textarea (demo)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = createElement("textarea") as HTMLTextAreaElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(true);
    expect(el.readOnly).toBe(true);
  });
});

describe("disableDemo directive - couverture complète", () => {
  // mock fetch globally for this describe as well
  const originalFetch = global.fetch;

  beforeEach(() => {
    (global.fetch as any) = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ role: null }) })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    document.body.innerHTML = "";
  });

  it("should not disable element if role is null (mounted)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ role: null }) })
    );
    const el = document.createElement("button") as HTMLButtonElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should disable a select element if role is demo", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = document.createElement("select") as HTMLSelectElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should disable a textarea and set readOnly if role is demo", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "demo" }),
      })
    );
    const el = document.createElement("textarea") as HTMLTextAreaElement;
    await (disableDemo as any).mounted(el, {} as any);
    expect(el.disabled).toBe(true);
    expect(el.readOnly).toBe(true);
  });

  it("should enable a textarea and remove readOnly if role is not demo (updated)", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: "admin" }),
      })
    );
    const el = document.createElement("textarea") as HTMLTextAreaElement;
    el.disabled = true;
    el.readOnly = true;
    await (disableDemo as any).updated(el, {} as any);
    expect(el.disabled).toBe(false);
    expect(el.readOnly).toBe(false);
  });

  it("should set and remove attributes for a div (demo/non-demo)", async () => {
    const el = document.createElement("div");
    (fetch as any)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "demo" }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: "admin" }),
        })
      );
    await (disableDemo as any).updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBe("true");
    expect(el.style.pointerEvents).toBe("none");
    expect(el.style.userSelect).toBe("none");
    expect(el.style.opacity).toBe("0.7");
    await (disableDemo as any).updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBeNull();
    expect(el.style.pointerEvents).toBe("");
    expect(el.style.userSelect).toBe("");
    expect(el.style.opacity).toBe("");
  });
});
