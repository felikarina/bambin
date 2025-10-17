import type { DirectiveBinding } from "vue";
import { getRole } from "./auth";

function setDisabled(el: HTMLElement, value: boolean) {
  if (el instanceof HTMLTextAreaElement) {
    el.disabled = value;
    el.readOnly = value;
  } else if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLButtonElement ||
    el instanceof HTMLSelectElement
  ) {
    el.disabled = value;
  } else {
    if (value) {
      el.setAttribute("data-demo-disabled", "true");
      el.style.pointerEvents = "none";
      el.style.userSelect = "none";
      el.style.opacity = "0.7";
    } else {
      el.removeAttribute("data-demo-disabled");
      el.style.pointerEvents = "";
      el.style.userSelect = "";
      el.style.opacity = "";
    }
  }
}

const disableDemo = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const role = getRole();
    setDisabled(el, role === "demo");
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const role = getRole();
    setDisabled(el, role === "demo");
  },
};

export default disableDemo;
