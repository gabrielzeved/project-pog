import * as PIXI from "pixi.js";
import { IApplicationOptions, Point } from "pixi.js";
import { ColliderComponent } from "./ECS/components/ColliderComponent";
import { Entity } from "./ECS/Entity";
import { InputSystem } from "./Events/InputSystem";
import { LayerManager } from "./Layer/LayerManager";

export class Application extends PIXI.Application {
  public entities: Array<Entity> = [];
  public layerManager: LayerManager = new LayerManager();
  public inputSystem = new InputSystem(this);

  constructor(options?: IApplicationOptions) {
    super(options);
    this.init();
  }

  init() {
    this.layerManager.add("root", 0);

    window.addEventListener("resize", () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }

  toLocal(pos: Point) {
    return this.stage.toLocal(pos);
  }

  boxCastAll(rect: PIXI.Rectangle) {
    return this.entities.filter((entity) => {
      const collider =
        entity.getComponent<ColliderComponent>(ColliderComponent);
      if (!collider) return false;
      return collider.checkCollision(rect, [0, 0]);
    });
  }
}
