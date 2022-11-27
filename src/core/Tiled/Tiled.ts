import * as PIXI from "pixi.js";
import { TilemapComponent } from "../ECS/components/TilemapComponent";
import {
  ILayer,
  IObject,
  IProperty,
  ITiledFile,
  ITileset,
  LayerType,
} from "./typings";

interface Tile {
  id: number;
  flippedHorizontally: boolean;
  flippedVertically: boolean;
  flippedDiagonally: boolean;
  //---------- UNUSED
  rotatedHexagonal120: boolean;
}

interface Object {
  x: number;
  y: number;
  width: number;
  height: number;
  tile: Tile;
  gid: number;
  id: number;
  name: string;
  properties?: IProperty[];
  visible: boolean;
}

export class Tilemap {
  layers: Layer[];
  tilesets: Tileset[];

  public static fromTiled(data: ITiledFile): Tilemap {
    const tilemap = new Tilemap();
    tilemap.layers = data.layers.map((layer) => Layer.fromTiled(layer));
    tilemap.tilesets = data.tilesets.map((tileset) =>
      Tileset.fromTiled(tileset)
    );
    return tilemap;
  }

  getLocalId(gid: number) {
    if (gid <= 0) return 0;
    const tileset = this.getTileset(gid)!;
    return tileset.firstgid - gid;
  }

  getTileset(gid: number) {
    if (gid <= 0) return undefined;

    let tileset;
    for (tileset of this.tilesets) {
      if (tileset.firstgid > gid) break;
    }
    return tileset;
  }

  toComponent() {
    return new TilemapComponent(this);
  }
}

export class Layer {
  tiles: Tile[];
  objects: Object[];
  width: number;
  height: number;
  type: LayerType;

  constructor(data: ILayer) {
    this.width = data.width;
    this.height = data.height;
    this.type = data.type;
  }

  public static fromTiled(data: ILayer): Layer {
    const layer = new Layer(data);

    if (data.type == "tilelayer") {
      layer.tiles = data.data.map(Tiled.processGID);
    } else if (data.type == "objectgroup") {
      layer.parseObjects(data);
    }
    return layer;
  }

  parseObjects(data: ILayer) {
    this.objects = data.objects.map(Tiled.processObject);
  }
}

export class Tileset {
  texture: PIXI.Texture;
  tilewidth: number;
  tileheight: number;

  imagewidth: number;
  imageheight: number;

  firstgid: number;

  constructor(
    tilewidth: number,
    tileheight: number,
    imagewidth: number,
    imageheight: number,
    firstgid: number
  ) {
    this.tilewidth = tilewidth;
    this.tileheight = tileheight;
    this.imagewidth = imagewidth;
    this.imageheight = imageheight;
    this.firstgid = firstgid;
  }

  public static fromTiled(data: ITileset): Tileset {
    const tileset = new Tileset(
      data.tilewidth,
      data.tileheight,
      data.imagewidth,
      data.imageheight,
      data.firstgid
    );
    tileset.texture = PIXI.Texture.from(data.image);
    return tileset;
  }
}

export namespace Tiled {
  export function processGID(gid: number): Tile {
    const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    const FLIPPED_VERTICALLY_FLAG = 0x40000000;
    const FLIPPED_DIAGONALLY_FLAG = 0x20000000;
    const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

    const flipped_horizontally = gid & FLIPPED_HORIZONTALLY_FLAG;
    const flipped_vertically = gid & FLIPPED_VERTICALLY_FLAG;
    const flipped_diagonally = gid & FLIPPED_DIAGONALLY_FLAG;
    const rotated_hex120 = gid & ROTATED_HEXAGONAL_120_FLAG;

    let tileId = gid;
    tileId &= ~(
      FLIPPED_HORIZONTALLY_FLAG |
      FLIPPED_VERTICALLY_FLAG |
      FLIPPED_DIAGONALLY_FLAG |
      ROTATED_HEXAGONAL_120_FLAG
    );

    return {
      id: tileId,
      flippedDiagonally: flipped_diagonally !== 0,
      flippedHorizontally: flipped_horizontally !== 0,
      flippedVertically: flipped_vertically !== 0,
      rotatedHexagonal120: rotated_hex120 !== 0,
    };
  }

  export function processObject(object: IObject): Object {
    return {
      ...object,
      tile: processGID(object.gid),
    };
  }
}
