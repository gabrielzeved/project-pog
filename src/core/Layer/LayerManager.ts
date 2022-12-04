import { Group, Layer } from "@pixi/layers";

export class LayerManager {
  private _layers: { [key: string]: Layer } = {};

  get(layer: string) {
    return this._layers[layer];
  }

  add(key: string, zIndex: number = 0) {
    this._layers[key] = new Layer(new Group(zIndex, true));
  }
}
