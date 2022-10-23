import { app } from "../../main";
import { KeyboardSystem } from "./Keyboard/KeyboardSystem";
import { MouseSystem } from "./Mouse/MouseSystem";

export interface InputSystemInterface {
  add(custom: unknown): void;
  remove(id: unknown): void;
  change(custom: unknown): void;
  read(id: unknown): unknown;

  handle(event: unknown): void;
  process(): void;
}

export class InputSystem {
  keyboard: KeyboardSystem;
  mouse: MouseSystem;

  constructor() {
    this.keyboard = new KeyboardSystem();
    this.mouse = new MouseSystem(app.view);
  }

  process() {
    this.keyboard.process();
    this.mouse.process();
  }

  handle(event: Event) {
    if (event instanceof KeyboardEvent) this.keyboard.handle(event);
  }
}
