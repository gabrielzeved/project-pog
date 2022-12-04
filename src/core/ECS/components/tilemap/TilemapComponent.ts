import { vec2 } from "gl-matrix";
import * as PIXI from "pixi.js";
import { layerManager } from "../../../../game/main";
import { Layer, Tilemap } from "../../../Tiled/Tiled";
import { Component } from "../../Component";

export class TilemapComponent extends Component {
  layersGraphics: { [key: string]: PIXI.Graphics } = {};
  layers: { [key: string]: Layer } = {};

  constructor(private tilemap: Tilemap) {
    super();
  }

  getTilePosition(pos: vec2) {
    return this.tilemap.getTilePosition(pos);
  }

  start() {
    this.draw();
  }

  update(_: number): void {}

  draw() {
    Object.values(this.layersGraphics).forEach((layer) => layer.destroy());
    this.layersGraphics = {};
    this.tilemap.layers.forEach((layer, index) => this.drawLayer(layer, index));
  }

  drawLayer(layer: Layer, index: number) {
    const layerContainer = new PIXI.Graphics();
    layerContainer.name = layer.name;
    this.entity.container.addChild(layerContainer);
    layerContainer.parentLayer = layerManager.get("root");
    layerContainer.zOrder = index;

    this.layersGraphics[layer.name] = layerContainer;

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
    this.layers[layer.name] = layer;
    const { tiles } = layer;

    const numberOfTilesX = layer.width;
    const numberOfTilesY = layer.height;

    for (let y = 0; y < numberOfTilesY; y++) {
      for (let x = 0; x < numberOfTilesX; x++) {
        const tile = tiles[y * numberOfTilesY + x];

        if (tile === undefined) continue;

        this.tile(x, y, tile.id - 1, layer.name);
      }
    }
  }

  drawObjectGroupLayer(layer: Layer) {
    const { objects } = layer;

    for (let object of objects) {
      const tileX = object.x;
      const tileY = object.y;

      // DONT KNOW WHY -object.height IS NECESSARY ;c
      this.tile(
        tileX,
        tileY - object.height,
        object.tile.id - 1,
        layer.name,
        true
      );
    }
  }

  tile(
    x: number,
    y: number,
    tile: number,
    layer: string,
    absolute: boolean = false
  ) {
    const container = this.layersGraphics[layer];

    if (!container)
      console.error(`[TilemapComponent]: layer ${layer} does not exists`);

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

    container.beginTextureFill({
      texture: tileTex,
    });
    container.drawRect(
      absolute ? x : x * tileset.tilewidth,
      absolute ? y : y * tileset.tileheight,
      tileset.tilewidth,
      tileset.tileheight
    );
  }
}
