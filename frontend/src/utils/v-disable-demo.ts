import type { DirectiveBinding } from "vue";

async function fetchRole(): Promise<string | null> {
  try {
    const res = await fetch("/api/current-user", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.role ?? null;
  } catch (e) {
    return null;
  }
}

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
  async mounted(el: HTMLElement, binding: DirectiveBinding) {
    const role = await fetchRole();
    setDisabled(el, role === "demo");
  },
  async updated(el: HTMLElement, binding: DirectiveBinding) {
    const role = await fetchRole();
    setDisabled(el, role === "demo");
  },
};

export default disableDemo;
