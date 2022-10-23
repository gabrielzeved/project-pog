import * as PIXI from "pixi.js";
import { AnimatedSprite, Spritesheet } from "pixi.js";
import { resources } from "../../../main";
import { Component } from "../Component";

export type ISpritesheetRendererComponent = PIXI.ISpritesheetData & {
  meta: {
    image: string;
  };
};

export class SpritesheetRendererComponent extends Component {
  spritesheet: Spritesheet;
  sprite: AnimatedSprite;
  currentAnimation: string;

  constructor(private data: ISpritesheetRendererComponent) {
    super();
  }

  start(): void {
    this.spritesheet = new PIXI.Spritesheet(
      resources.textures[this.data.meta.image],
      this.data
    );

    this.spritesheet.parse().then(() => {
      this.sprite = new PIXI.AnimatedSprite(this.spritesheet.animations.enemy);
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
