import { Entity } from "./Entity";

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export abstract class Component {
  entity: Entity;

  get name(): string {
    return this.constructor.name;
  }

  start(): void {}

  update(_: number): void {}
}
