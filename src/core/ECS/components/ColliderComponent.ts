import { vec2 } from "gl-matrix";
import * as PIXI from "pixi.js";
import { Rectangle } from "pixi.js";
import { Component } from "../Component";
import { TilemapColliderComponent } from "./tilemap/TilemapColliderComponent";

interface ColliderComponentProps {
  rect: PIXI.Rectangle;
}

export class ColliderComponent extends Component {
  rect: PIXI.Rectangle;
  graphics: PIXI.Graphics;
  colliding: boolean;

  constructor(props: ColliderComponentProps) {
    super();
    this.rect = props.rect;
    this.colliding = false;
  }

  //-------------------------------------------------------------------------
  //|
  //|
  //|
  //|     THIS IS THE WORSE IMPLEMENTATION FOR PERFORMANCE => FIX THAT LATER
  //|
  //|
  //|
  //--------------------------------------------------------------------------
  checkCollision(other: PIXI.Rectangle, pos: vec2): boolean;
  checkCollision(other: ColliderComponent, pos: vec2): boolean;
  checkCollision(
    other: PIXI.Rectangle | ColliderComponent,
    pos: vec2 = [0, 0]
  ): boolean {
    const [x, y] = pos;

    const rect = new Rectangle(
      this.entity.container.position.x + this.rect.x,
      this.entity.container.position.y + this.rect.y,
      this.rect.width,
      this.rect.height
    );

    const min1 = new PIXI.Point(rect.left, rect.top);
    const max1 = new PIXI.Point(rect.right, rect.bottom);

    const otherRect =
      other instanceof ColliderComponent
        ? new Rectangle(
            other.entity.container.position.x + other.rect.x + x,
            other.entity.container.position.y + other.rect.y + y,
            other.rect.width,
            other.rect.height
          )
        : other;

    const min2 = new PIXI.Point(otherRect.left, otherRect.top);
    const max2 = new PIXI.Point(otherRect.right, otherRect.bottom);

    if (
      max1.x > min2.x &&
      min1.x < max2.x &&
      max1.y > min2.y &&
      min1.y < max2.y
    )
      return true;
    return false;
  }

  isColliding(pos: vec2 = [0, 0]) {
    return this.entity.app.entities.some((entity) => {
      const collider =
        entity.getComponent<ColliderComponent>(ColliderComponent) ||
        entity.getComponent<TilemapColliderComponent>(TilemapColliderComponent);
      return (
        entity.id !== this.entity.id &&
        collider &&
        collider.checkCollision(this, pos)
      );
    });
  }

  start(): void {
    this.graphics = new PIXI.Graphics();
    this.entity.container.addChild(this.graphics);
  }

  update(): void {
    this.graphics.clear();

    const colliding = this.isColliding();

    this.colliding = colliding;

    const color = colliding ? 0xff0000 : 0x000000;

    this.graphics.lineStyle({
      width: 1,
      color,
    });
    this.graphics.drawRect(
      this.rect.x + this.entity.pivot[0],
      this.rect.y + this.entity.pivot[1],
      this.rect.width,
      this.rect.height
    );
  }
}
