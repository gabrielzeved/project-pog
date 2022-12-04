import { vec2 } from "gl-matrix";
import { Rectangle } from "pixi.js";
import { Component } from "../../Component";
import { ColliderComponent } from "../ColliderComponent";
import { TilemapComponent } from "./TilemapComponent";

export class TilemapColliderComponent extends Component {
  tilemap: TilemapComponent;

  checkLayerCollision(pos: vec2, layerName: string) {
    if (!this.tilemap.layers[layerName]) {
      throw new Error(
        `[TilemapColliderComponent] : Layer "${layerName} does not exist"`
      );
    }

    const layer = this.tilemap.layers[layerName];
    const tiles = layer.tiles;

    const numberOfTilesY = layer.height;
    const [x, y] = this.tilemap.getTilePosition(pos);

    return tiles[y * numberOfTilesY + x].id > 0;
  }

  checkCollision(other: ColliderComponent, pos: vec2 = [0, 0]): boolean {
    const [x, y] = pos;

    const otherRect = new Rectangle(
      other.entity.container.position.x + other.rect.x + x,
      other.entity.container.position.y + other.rect.y + y,
      other.rect.width,
      other.rect.height
    );

    const lt: vec2 = [otherRect.left, otherRect.top];
    const lb: vec2 = [otherRect.left, otherRect.bottom];
    const rt: vec2 = [otherRect.right, otherRect.top];
    const rb: vec2 = [otherRect.right, otherRect.bottom];

    return Object.values(this.tilemap.layers).some(
      (layer) =>
        layer.solid &&
        (this.checkLayerCollision(lt, layer.name) ||
          this.checkLayerCollision(lb, layer.name) ||
          this.checkLayerCollision(rt, layer.name) ||
          this.checkLayerCollision(rb, layer.name))
    );
  }

  start(): void {
    this.tilemap = this.entity.getComponent<TilemapComponent>(TilemapComponent);
  }
  update(): void {}
}
