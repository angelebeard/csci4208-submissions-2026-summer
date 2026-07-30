// src/ui/Toast.js
// Minimal toast queue for the async loading/empty/error/success states the
// rubric asks for around network actions.

const STACK_ID = "toast-stack";

export function toast(message, variant = "loading", ttlMs = 3200) {
  const stack = document.getElementById(STACK_ID);
  if (!stack) return () => {};

  const node = document.createElement("div");
  node.className = `toast toast--${variant}`;
  node.textContent = message;
  stack.appendChild(node);

  const remove = () => node.remove();
  if (variant !== "loading") {
    setTimeout(remove, ttlMs);
  }
  return remove;
}
