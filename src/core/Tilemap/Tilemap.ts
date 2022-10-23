import { vec2 } from "gl-matrix";
import * as PIXI from "pixi.js";

export class Tilemap {
  tiles: number[][];
  tileset: PIXI.Texture;
  tileSize: vec2;

  container = new PIXI.Container();

  draw() {
    const numberOfTilesX = this.tiles[0].length;
    const numberOfTilesY = this.tiles.length;

    const totalTilesetX = this.tileset.width / this.tileSize[0];

    for (let y = 0; y < numberOfTilesY; y++) {
      for (let x = 0; x <= numberOfTilesX; x++) {
        const tile = this.tiles[y][x];

        if (tile === undefined) continue;

        const indexX = tile % totalTilesetX;
        const indexY = Math.floor(tile / totalTilesetX);

        const graphics = new PIXI.Graphics();
        graphics.beginTextureFill({
          matrix: new PIXI.Matrix().translate(
            -this.tileSize[0] * indexX,
            -this.tileSize[1] * indexY
          ),
          texture: this.tileset,
        });
        graphics.drawRect(0, 0, this.tileSize[0], this.tileSize[1]);
        graphics.position.set(x * this.tileSize[0], y * this.tileSize[1]);
        this.container.addChild(graphics);
      }
    }
  }
}
