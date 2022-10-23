import { Key } from "ts-keycode-enum";
import { InputSystemInterface } from "../InputSystem";

export type IKeyboardSystem = { [key in Key]?: string[] };
export type KeyboardState = { [key in Key]?: KeyState };
export type IKeyboardSystemCustom = { [key: string]: Key };

export type CustomKeyboardInput = {
  id: string;
  key: Key;
};

export enum KeyboardEventAction {
  KEY_DOWN,
  KEY_HOLD,
  KEY_UP,
}

export interface KeyState {
  action: KeyboardEventAction;
  key: Key;
}

export class KeyboardSystem implements InputSystemInterface {
  system: IKeyboardSystem = {};
  customInputs: IKeyboardSystemCustom = {};

  constructor() {
    this._setupEvents();
    Object.entries(Key).forEach((key) => {
      if (typeof key[1] !== "string") this.system[key[1] as Key] = [key[0]];
    });
  }

  state: KeyboardState = {};

  // JUST PRESSED
  isKeyDown(key: Key | string) {
    if (typeof key === "string") {
      if (!this.customInputs[key]) return false;
      key = this.customInputs[key];
    }

    return this.state[key]?.action === KeyboardEventAction.KEY_DOWN;
  }

  // JUST RELEASED
  isKeyUp(key: Key | string) {
    if (typeof key === "string") {
      if (!this.customInputs[key]) return false;
      key = this.customInputs[key];
    }

    return this.state[key]?.action === KeyboardEventAction.KEY_UP;
  }

  // JUST PRESSED OR HOLDING
  isKey(key: Key | string) {
    if (typeof key === "string") {
      if (!this.customInputs[key]) return false;
      key = this.customInputs[key];
    }

    return (
      this.state[key] && this.state[key]?.action !== KeyboardEventAction.KEY_UP
    );
  }

  handle(event: KeyboardEvent): void {
    const key = event.keyCode as Key;

    if (event.type === "keydown") {
      const keyState = this.state[key];

      if (!keyState) {
        this.state[key] = {
          action: KeyboardEventAction.KEY_DOWN,
          key,
        };
      }
    } else if (event.type === "keyup") {
      this.state[key] = {
        action: KeyboardEventAction.KEY_UP,
        key,
      };
    }
  }

  //PROCESS AFTER HANDLE EVENTS
  process(): void {
    Object.values(this.state).forEach((state) => {
      const key = state.key;

      if (state.action === KeyboardEventAction.KEY_DOWN) {
        state.action = KeyboardEventAction.KEY_HOLD;
      }

      if (state.action === KeyboardEventAction.KEY_UP) {
        delete this.state[key];
      }
    });
  }

  /* CUSTOM INPUT CRUD */

  add(custom: CustomKeyboardInput) {
    const { id, key } = custom;
    this.customInputs[id] = key;
  }

  remove(id: string) {
    delete this.customInputs[id];
  }

  change(custom: CustomKeyboardInput): void {
    const { id, key } = custom;
    this.customInputs[id] = key;
  }

  read(id: string): Key | undefined {
    return this.customInputs[id];
  }

  /* END CUSTOM INPUT CRUD */

  private _setupEvents() {
    window.addEventListener(
      "keydown",
      (event) => {
        this.handle(event);
      },
      false
    );

    window.addEventListener(
      "keyup",
      (event) => {
        this.handle(event);
      },
      false
    );
  }
}
