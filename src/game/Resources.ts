import * as PIXI from "pixi.js";

export type TextureResource = [string, string];

export class Resources {
  private _texturesResources: TextureResource[] = [
    ["character", "character.png"],
    ["tileset", "tileset.png"],
  ];

  loader: PIXI.Loader;
  textures: Record<string, PIXI.Texture> = {};

  constructor() {
    this.loader = new PIXI.Loader();
  }

  afterLoad() {
    this._texturesResources.forEach((texture) => {
      this.textures[texture[0]] = this.loader.resources[texture[0]].texture!;
    });
  }

  start(afterLoad?: Function) {
    const options = {
      crossOrigin: "*",
      loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
      xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB,
    };

    this._texturesResources.forEach((texture) => {
      this.loader.add(texture[0], texture[1], options);
    });

    this.loader.load(() => {
      this.afterLoad();
      afterLoad?.();
    });
  }
}
