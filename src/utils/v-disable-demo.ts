import type { DirectiveBinding } from "vue";

function setDisabled(el: HTMLElement, value: boolean) {
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLButtonElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  ) {
    el.disabled = value;
    if (el instanceof HTMLTextAreaElement) {
      el.readOnly = value;
    }
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
    const role = localStorage.getItem("role");
    if (role === "demo") {
      setDisabled(el, true);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const role = localStorage.getItem("role");
    if (role === "demo") {
      setDisabled(el, true);
    } else {
      setDisabled(el, false);
    }
  },
};

export default disableDemo;
