import * as PIXI from "pixi.js";
import { AnimatedSprite, Spritesheet } from "pixi.js";
import { Component } from "../Component";
import { ISpriteComponent } from "./SpriteComponent";

interface SpritesheetData extends PIXI.ISpritesheetData {
  meta: any;
}

interface AsepriteSpritesheetData extends SpritesheetData {
  meta: {
    scale: string;
    related_multi_packs?: string[];
    frameTags: [
      {
        name: string;
        from: number;
        to: number;
        direction: string;
        color: string;
      }
    ];
  };
}

export type IAnimatedSpriteComponent = ISpriteComponent & {
  spritesheetData: SpritesheetData;
  initialAnimation: string;
  speed: number;
};

export class AnimatedSpriteComponent extends Component {
  spritesheet: Spritesheet;
  sprite: AnimatedSprite;
  currentAnimation: string;
  speed: number;

  constructor(private props: IAnimatedSpriteComponent) {
    super();
    this.currentAnimation = props.initialAnimation;
    this.speed = props.speed;
    this.aseprite();
  }

  aseprite(): void {
    const meta = this.props.spritesheetData.meta;
    const isAseprite = meta.app === "http://www.aseprite.org/";

    if (!isAseprite) return;

    const asepriteInfo = (this.props.spritesheetData as AsepriteSpritesheetData)
      .meta;

    for (const tag of asepriteInfo.frameTags) {
      const frames = [];
      for (let i = tag.from; i < tag.to; i++) {
        const frameKey = Object.keys(this.props.spritesheetData.frames)[i];
        frames.push(frameKey);
      }

      if (tag.direction === "pingpong") {
        for (let i = tag.to; i >= tag.from; i--) {
          const frameKey = Object.keys(this.props.spritesheetData.frames)[i];
          frames.push(frameKey);
        }
      }
      this.props.spritesheetData.animations ??= {};
      this.props.spritesheetData.animations[tag.name] = frames;
    }
  }

  start(): void {
    this.spritesheet = new PIXI.Spritesheet(
      this.props.texture,
      this.props.spritesheetData
    );

    this.spritesheet.parse().then(() => {
      this.sprite = new PIXI.AnimatedSprite(
        this.spritesheet.animations[this.props.initialAnimation]
      );
      this.sprite.pivot = this.props.pivot ?? new PIXI.Point();
      this.sprite.animationSpeed = this.speed;
      this.sprite.play();
      this.entity.container.addChild(this.sprite);
    });
  }

  update(_: number): void {}

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

  destroy() {
    this.entity.container.destroy();
  }
}
