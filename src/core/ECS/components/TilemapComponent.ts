import { vec2 } from "gl-matrix";
import * as PIXI from "pixi.js";
import { Component } from "../Component";

export interface TilemapComponentProps {
  tiles: number[];
  tileset: PIXI.Texture;
  tileSize: vec2;
  width: number;
  height: number;
}

export class TilemapComponent extends Component {
  tiles: PIXI.Graphics;

  private totalTilesetX: number;

  constructor(private props: TilemapComponentProps) {
    super();
    this.totalTilesetX = props.tileset.width / props.tileSize[0];
  }

  start() {
    this.tiles = new PIXI.Graphics();
    this.entity.container.addChild(this.tiles);
    this.draw();
  }

  update(_: number): void {}

  draw() {
    const { tiles } = this.props;

    const numberOfTilesX = this.props.width;
    const numberOfTilesY = this.props.height;

    this.tiles.clear();

    for (let y = 0; y < numberOfTilesY; y++) {
      for (let x = 0; x < numberOfTilesX; x++) {
        const tile = tiles[y * numberOfTilesY + x] - 1;

        if (tile === undefined) continue;

        this.tile(x, y, tile);
      }
    }
  }

  tile(x: number, y: number, tile: number) {
    const { tileSize, tileset } = this.props;

    const indexX = tile % this.totalTilesetX;
    const indexY = Math.floor(tile / this.totalTilesetX);

    const tileTex = new PIXI.Texture(
      tileset.baseTexture,
      new PIXI.Rectangle(
        tileSize[0] * indexX,
        tileSize[1] * indexY,
        tileSize[0],
        tileSize[1]
      )
    );

    this.tiles.beginTextureFill({
      texture: tileTex,
    });
    this.tiles.drawRect(
      x * tileSize[0],
      y * tileSize[1],
      tileSize[0],
      tileSize[1]
    );
  }
}
