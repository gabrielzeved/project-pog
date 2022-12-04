import { InputSystem } from "../Events/InputSystem";
import { Entity } from "./Entity";

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export abstract class Component {
  entity: Entity;

  get name(): string {
    return this.constructor.name;
  }

  get inputSystem(): InputSystem {
    return this.entity.parentApp.inputSystem;
  }

  abstract start(): void;
  abstract update(delta: number): void;
  destroy(): void {}
}
