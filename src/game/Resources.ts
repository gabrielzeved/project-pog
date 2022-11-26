import * as PIXI from "pixi.js";
import { TiledFile } from "../core/Tiled/typings";

export type Resource = [string, string];

export enum ResourceType {
  TEXTURE,
  MAP,
}

export class Resources {
  private _texturesResources: Resource[] = [
    ["character", "GUMDROP.PNG"],
    ["tileset", "tileset.png"],
    ["tree", "tree.png"],
    ["effect", "effect.png"],
  ];
  private _mapResources: Resource[] = [["teste", "maps/teste.json"]];

  textures: Record<string, PIXI.Texture> = {};
  maps: Record<string, TiledFile> = {};

  loader: PIXI.Loader;

  constructor() {
    this.loader = new PIXI.Loader();
  }

  afterLoad() {
    this._texturesResources.forEach((texture) => {
      this.textures[texture[0]] = this.loader.resources[texture[0]].texture!;
    });

    this._mapResources.forEach((map) => {
      this.maps[map[0]] = this.loader.resources[map[0]].data;
    });
  }

  loadResource(type: ResourceType, resource: Resource) {
    if (this.loader.resources[resource[0]])
      if (type === ResourceType.TEXTURE) {
        this.textures[resource[0]] =
          this.loader.resources[resource[0]].texture!;
        return this.textures[resource[0]];
      } else if (type === ResourceType.MAP) {
        this.maps[resource[0]] = this.loader.resources[resource[0]].data;
        return this.maps[resource[0]];
      }

    this.loader.add(resource[0], resource[1]);

    return new Promise((resolve) => {
      this.loader.load(() => {
        if (type === ResourceType.TEXTURE) {
          this.textures[resource[0]] =
            this.loader.resources[resource[0]].texture!;
          resolve(this.textures[resource[0]]);
        } else if (type === ResourceType.MAP) {
          this.maps[resource[0]] = this.loader.resources[resource[0]].data;
          resolve(this.maps[resource[0]]);
        }
      });
    });
  }

  start(afterLoad?: Function) {
    this._texturesResources.forEach((texture) => {
      this.loader.add(texture[0], texture[1], {
        crossOrigin: "*",
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB,
      });
    });

    this._mapResources.forEach((map) => {
      this.loader.add(map[0], map[1]);
    });

    this.loader.load(() => {
      this.afterLoad();
      afterLoad?.();
    });
  }
}
