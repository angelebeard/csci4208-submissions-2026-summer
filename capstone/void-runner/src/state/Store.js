// src/state/Store.js
// A tiny, framework-free observable store. Views subscribe to slices of
// state and re-render on change; nothing here knows about the DOM.

export class Store {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._listeners = new Set();
  }

  getState() {
    return this._state;
  }

  /** Shallow-merge a patch into state and notify subscribers. */
  setState(patch) {
    const patchObj = typeof patch === "function" ? patch(this._state) : patch;
    this._state = { ...this._state, ...patchObj };
    for (const listener of this._listeners) listener(this._state);
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
}
