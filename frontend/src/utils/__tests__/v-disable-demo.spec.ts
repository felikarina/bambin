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

  beforeEach(() => {
    originalGetItem = window.localStorage.getItem;
    // Clean up localStorage to avoid side effects
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.getItem = originalGetItem;
    document.body.innerHTML = "";
  });

  it("should disable element if role is demo (mounted)", () => {
    window.localStorage.setItem("role", "demo");
    const el = createElement("button") as HTMLButtonElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should not disable element if role is not demo (mounted)", () => {
    window.localStorage.setItem("role", "admin");
    const el = createElement("button") as HTMLButtonElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should disable element if role is demo (updated)", () => {
    window.localStorage.setItem("role", "demo");
    const el = createElement("button") as HTMLButtonElement;
    disableDemo.updated(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should enable element if role is not demo (updated)", () => {
    window.localStorage.setItem("role", "admin");
    const el = createElement("button") as HTMLButtonElement;
    el.disabled = true;
    disableDemo.updated(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should set attributes for non-form elements (demo)", () => {
    window.localStorage.setItem("role", "demo");
    const el = createElement("div");
    disableDemo.updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBe("true");
    expect(el.style.pointerEvents).toBe("none");
    expect(el.style.userSelect).toBe("none");
    expect(el.style.opacity).toBe("0.7");
  });

  it("should remove attributes for non-form elements (not demo)", () => {
    window.localStorage.setItem("role", "admin");
    const el = createElement("div");
    el.setAttribute("data-demo-disabled", "true");
    el.style.pointerEvents = "none";
    el.style.userSelect = "none";
    el.style.opacity = "0.7";
    disableDemo.updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBeNull();
    expect(el.style.pointerEvents).toBe("");
    expect(el.style.userSelect).toBe("");
    expect(el.style.opacity).toBe("");
  });

  it("should set readOnly for textarea (demo)", () => {
    window.localStorage.setItem("role", "demo");
    const el = createElement("textarea") as HTMLTextAreaElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(true);
    expect(el.readOnly).toBe(true);
  });
});

describe("disableDemo directive - couverture complète", () => {
  let originalGetItem: typeof window.localStorage.getItem;

  beforeEach(() => {
    originalGetItem = window.localStorage.getItem;
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.getItem = originalGetItem;
    document.body.innerHTML = "";
  });

  it("should not disable element if role is null (mounted)", () => {
    window.localStorage.removeItem("role");
    const el = document.createElement("button") as HTMLButtonElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(false);
  });

  it("should disable a select element if role is demo", () => {
    window.localStorage.setItem("role", "demo");
    const el = document.createElement("select") as HTMLSelectElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(true);
  });

  it("should disable a textarea and set readOnly if role is demo", () => {
    window.localStorage.setItem("role", "demo");
    const el = document.createElement("textarea") as HTMLTextAreaElement;
    disableDemo.mounted(el, {} as any);
    expect(el.disabled).toBe(true);
    expect(el.readOnly).toBe(true);
  });

  it("should enable a textarea and remove readOnly if role is not demo (updated)", () => {
    window.localStorage.setItem("role", "admin");
    const el = document.createElement("textarea") as HTMLTextAreaElement;
    el.disabled = true;
    el.readOnly = true;
    disableDemo.updated(el, {} as any);
    expect(el.disabled).toBe(false);
    expect(el.readOnly).toBe(false);
  });

  it("should set and remove attributes for a div (demo/non-demo)", () => {
    const el = document.createElement("div");
    window.localStorage.setItem("role", "demo");
    disableDemo.updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBe("true");
    expect(el.style.pointerEvents).toBe("none");
    expect(el.style.userSelect).toBe("none");
    expect(el.style.opacity).toBe("0.7");
    window.localStorage.setItem("role", "admin");
    disableDemo.updated(el, {} as any);
    expect(el.getAttribute("data-demo-disabled")).toBeNull();
    expect(el.style.pointerEvents).toBe("");
    expect(el.style.userSelect).toBe("");
    expect(el.style.opacity).toBe("");
  });
});
