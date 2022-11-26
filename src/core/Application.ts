import * as PIXI from "pixi.js";
import { Entity } from "./ECS/Entity";

export class Application extends PIXI.Application {
  public entities: Array<Entity> = [];

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }
}
