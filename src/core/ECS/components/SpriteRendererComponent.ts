import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { resources } from "../../../main";
import { Component } from "../Component";

export interface ISpriteRendererComponent {
  texture: string;
}

export class SpriteRendererComponent extends Component {
  sprite: Sprite;

  constructor(private props: ISpriteRendererComponent) {
    super();
  }

  start(): void {
    this.sprite = new PIXI.Sprite(resources.textures[this.props.texture]);
    this.entity.container.addChild(this.sprite);
  }
}
