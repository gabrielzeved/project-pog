import * as PIXI from "pixi.js";
import { Layer, Tilemap } from "../../Tiled/Tiled";
import { Component } from "../Component";

export class TilemapComponent extends Component {
  tiles: PIXI.Graphics;

  constructor(private tilemap: Tilemap) {
    super();
  }

  start() {
    this.tiles = new PIXI.Graphics();
    this.entity.container.addChild(this.tiles);
    this.draw();
  }

  update(_: number): void {}

  draw() {
    this.tiles.clear();
    this.tilemap.layers.forEach((layer) => this.drawLayer(layer));
  }

  drawLayer(layer: Layer) {
    switch (layer.type) {
      case "tilelayer":
        this.drawTileLayer(layer);
        break;
      case "objectgroup":
        this.drawObjectGroupLayer(layer);
        break;
    }
  }

  drawTileLayer(layer: Layer) {
    const { tiles } = layer;

    const numberOfTilesX = layer.width;
    const numberOfTilesY = layer.height;

    for (let y = 0; y < numberOfTilesY; y++) {
      for (let x = 0; x < numberOfTilesX; x++) {
        const tile = tiles[y * numberOfTilesY + x];

        if (tile === undefined) continue;

        this.tile(x, y, tile.id - 1);
      }
    }
  }

  drawObjectGroupLayer(layer: Layer) {
    const { objects } = layer;

    for (let object of objects) {
      const tileX = object.x / object.width;
      const tileY = object.y / object.height;

      // DONT KNOW WHY -1 IS NECESSARY ;c
      this.tile(tileX, tileY - 1, object.tile.id);
    }
  }

  tile(x: number, y: number, tile: number) {
    //+1 DUE THE TILED FORMAT STARTS INDEX FROM 1
    const tileset = this.tilemap.getTileset(tile + 1);
    if (!tileset) {
      return;
    }

    const totalTilesetX = tileset.imagewidth / tileset.tilewidth;

    const indexX = tile % totalTilesetX;
    const indexY = Math.floor(tile / totalTilesetX);

    const tileTex = new PIXI.Texture(
      tileset.texture.castToBaseTexture(),
      new PIXI.Rectangle(
        tileset.tilewidth * indexX,
        tileset.tileheight * indexY,
        tileset.tilewidth,
        tileset.tileheight
      )
    );

    this.tiles.beginTextureFill({
      texture: tileTex,
    });
    this.tiles.drawRect(
      x * tileset.tilewidth,
      y * tileset.tileheight,
      tileset.tilewidth,
      tileset.tileheight
    );
  }
}
