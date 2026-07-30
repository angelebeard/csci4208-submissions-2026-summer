// src/ui/InputManager.js
// Translates raw DOM events (keyboard, pointer/touch) into the plain input
// object GameEngine/Player expect. Keeps event wiring out of the engine.

export class InputManager {
  constructor(target, engine) {
    this.target = target;
    this.engine = engine;
    this.state = { left: false, right: false, up: false, down: false, pointer: null };

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    target.addEventListener("pointermove", this._onPointerMove);
    target.addEventListener("pointerleave", this._onPointerLeave);
    target.addEventListener("pointerdown", this._onPointerDown);
  }

  _onKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft": case "a": case "A": this.state.left = true; break;
      case "ArrowRight": case "d": case "D": this.state.right = true; break;
      case "ArrowUp": case "w": case "W": this.state.up = true; break;
      case "ArrowDown": case "s": case "S": this.state.down = true; break;
      case " ": this.engine.setInput({ dashRequested: true }); break;
      case "p": case "P": case "Escape": this.engine.state.togglePause(); break;
      default: return;
    }
    this._flush();
  }

  _onKeyUp(e) {
    switch (e.key) {
      case "ArrowLeft": case "a": case "A": this.state.left = false; break;
      case "ArrowRight": case "d": case "D": this.state.right = false; break;
      case "ArrowUp": case "w": case "W": this.state.up = false; break;
      case "ArrowDown": case "s": case "S": this.state.down = false; break;
      default: return;
    }
    this._flush();
  }

  _onPointerMove(e) {
    const rect = this.target.getBoundingClientRect();
    this.state.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this._flush();
  }

  _onPointerLeave() {
    this.state.pointer = null;
    this._flush();
  }

  _onPointerDown() {
    this.engine.setInput({ dashRequested: true });
  }

  _flush() {
    this.engine.setInput({ ...this.state });
  }

  destroy() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    this.target.removeEventListener("pointermove", this._onPointerMove);
    this.target.removeEventListener("pointerleave", this._onPointerLeave);
    this.target.removeEventListener("pointerdown", this._onPointerDown);
  }
}
