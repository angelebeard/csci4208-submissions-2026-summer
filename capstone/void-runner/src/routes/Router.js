// src/routes/Router.js
// Domain class: a small hash-based view manager. Each registered view is
// an object with mount(rootEl, params, ctx) => optional cleanup fn.
// The router owns view lifecycle and gives each view its own
// AbortController so in-flight fetches are cancelled on navigation.

export class Router {
  constructor(rootEl, ctx) {
    this.rootEl = rootEl;
    this.ctx = ctx;
    this.routes = new Map();
    this._cleanup = null;
    this._controller = null;
    window.addEventListener("hashchange", () => this._render());
  }

  register(path, view) {
    this.routes.set(path, view);
    return this;
  }

  start(defaultPath = "#/title") {
    if (!location.hash) location.hash = defaultPath;
    this._render();
  }

  navigate(path, params = {}) {
    this._pendingParams = params;
    if (location.hash === path) this._render();
    else location.hash = path;
  }

  async _render() {
    if (this._cleanup) {
      try { this._cleanup(); } catch { /* noop */ }
      this._cleanup = null;
    }
    if (this._controller) this._controller.abort();
    this._controller = new AbortController();

    const path = location.hash || "#/title";
    const view = this.routes.get(path) ?? this.routes.get("#/title");
    this.rootEl.innerHTML = "";

    const params = this._pendingParams ?? {};
    this._pendingParams = null;

    const result = await view.mount(this.rootEl, params, {
      ...this.ctx,
      signal: this._controller.signal,
      navigate: (p, pr) => this.navigate(p, pr),
    });
    this._cleanup = typeof result === "function" ? result : null;
  }
}
