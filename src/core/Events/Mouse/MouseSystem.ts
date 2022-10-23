import * as PIXI from "pixi.js";
import { InputSystemInterface } from "../InputSystem";

export type MouseState = { [key in MouseButton]?: MouseEventAction };
export type IMouseSystemCustom = { [key: string]: MouseButton };

export type CustomMouseInput = {
  id: string;
  button: MouseButton;
};

export enum MouseEventType {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
}

export enum MouseEventAction {
  MOUSE_DOWN,
  MOUSE_HOLD,
  MOUSE_UP,
}

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  FOURTH = 3,
  FIFTH = 4,
}

export class MouseSystem implements InputSystemInterface {
  position: PIXI.Point = new PIXI.Point(0, 0);
  customInputs: IMouseSystemCustom = {};
  state: MouseState = {};

  constructor(private view: HTMLCanvasElement) {
    this._setupEvents();
  }

  // JUST PRESSED
  isButtonDown(button: MouseButton | string) {
    if (typeof button === "string") {
      if (this.customInputs[button] === undefined) return false;
      button = this.customInputs[button];
    }

    return this.state[button] === MouseEventAction.MOUSE_DOWN;
  }

  // JUST RELEASED
  isButtonUp(button: MouseButton | string) {
    if (typeof button === "string") {
      if (this.customInputs[button] === undefined) return false;
      button = this.customInputs[button];
    }

    return this.state[button] === MouseEventAction.MOUSE_UP;
  }

  // JUST PRESSED OR HOLDING
  isButton(button: MouseButton | string) {
    if (typeof button === "string") {
      if (this.customInputs[button] === undefined) return false;
      button = this.customInputs[button];
    }

    return (
      this.state[button] && this.state[button] !== MouseEventAction.MOUSE_UP
    );
  }

  handle(event: MouseEvent): void {
    const button = event.button as MouseButton;

    if (event.type === "mousemove") {
      var rect = this.view.getBoundingClientRect();
      var x = event.clientX - rect.left; //x position within the element.
      var y = event.clientY - rect.top; //y position within the element.

      this.position.set(x, y);
    } else if (event.type === "mouseup") {
      this.state[button] = MouseEventAction.MOUSE_UP;
    } else if (event.type === "mousedown") {
      const buttonState = this.state[button];
      if (!buttonState) {
        this.state[button] = MouseEventAction.MOUSE_DOWN;
      }
    }
  }

  process(): void {
    Object.entries(this.state).forEach((entry) => {
      const [key, action] = entry;

      const button = key as unknown as MouseButton;

      if (action === MouseEventAction.MOUSE_DOWN) {
        this.state[button] = MouseEventAction.MOUSE_HOLD;
      }

      if (action === MouseEventAction.MOUSE_UP) {
        delete this.state[button];
      }
    });
  }

  add(custom: CustomMouseInput) {
    const { id, button } = custom;
    this.customInputs[id] = button;
  }

  remove(id: string) {
    delete this.customInputs[id];
  }

  change(custom: CustomMouseInput): void {
    const { id, button } = custom;
    this.customInputs[id] = button;
  }

  read(id: string): MouseButton | undefined {
    return this.customInputs[id];
  }

  private _setupEvents() {
    this.view.addEventListener("mousemove", (e) => {
      this.handle(e);
    });
    this.view.addEventListener("mousedown", (e) => {
      this.handle(e);
    });
    this.view.addEventListener("mouseup", (e) => {
      this.handle(e);
    });
  }
}
