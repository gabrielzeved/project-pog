import * as PIXI from "pixi.js";
import { resources } from "../../game/main";
import { ResourceType } from "../../game/Resources";
import {
  TilemapComponent,
  TilemapComponentProps,
} from "../ECS/components/TilemapComponent";
import { Layer, Tileset } from "./typings";

export async function Layer2Tilemap(map: Layer, tileset: Tileset) {
  const resource = (await resources.loadResource(ResourceType.TEXTURE, [
    tileset.name,
    tileset.image,
  ])) as PIXI.Texture;

  const props: TilemapComponentProps = {
    height: map.height,
    width: map.width,
    tiles: map.data,
    tileset: resource,
    tileSize: [tileset.tilewidth, tileset.tileheight],
  };

  return new TilemapComponent(props);
}
