import * as PIXI from "pixi.js";
import { AnimatedSprite, Spritesheet } from "pixi.js";
import { Component } from "../Component";

export type ISpritesheetRendererComponent = {
  spritesheetData: PIXI.ISpritesheetData;
  texture: PIXI.Texture<PIXI.Resource>;
  initialAnimation: string;
};

export class SpritesheetRendererComponent extends Component {
  spritesheet: Spritesheet;
  sprite: AnimatedSprite;
  currentAnimation: string;

  constructor(private data: ISpritesheetRendererComponent) {
    super();
    this.currentAnimation = data.initialAnimation;
  }

  start(): void {
    this.spritesheet = new PIXI.Spritesheet(
      this.data.texture,
      this.data.spritesheetData
    );

    this.spritesheet.parse().then(() => {
      this.sprite = new PIXI.AnimatedSprite(
        this.spritesheet.animations[this.data.initialAnimation]
      );
      this.sprite.animationSpeed = 0.167;
      this.sprite.play();
      this.entity.container.addChild(this.sprite);
    });
  }

  changeAnimation(animation: string) {
    if (this.currentAnimation !== animation) {
      this.sprite.textures = this.spritesheet.animations[animation];
      this.play();
      this.currentAnimation = animation;
    }
  }

  stop() {
    this.sprite.stop();
  }

  play() {
    this.sprite.play();
  }

  isPlaying() {
    this.sprite.playing;
  }
}
