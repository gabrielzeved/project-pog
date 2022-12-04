import * as PIXI from "pixi.js";
import { Component } from "../../Component";

export interface ISpriteComponent {
  texture: PIXI.Texture;
  pivot?: PIXI.Point;
}

export class SpriteComponent extends Component {
  sprite: PIXI.Sprite;

  constructor(private props: ISpriteComponent) {
    super();
  }

  start(): void {
    this.sprite = new PIXI.Sprite(this.props.texture);
    this.sprite.pivot = this.props.pivot ?? new PIXI.Point();
    this.entity.container.addChild(this.sprite);
  }

  update(_: number): void {}
}
