import * as PIXI from "pixi.js";
import { Component } from "../../core/ECS/Component";

interface IHealthComponent {
  max: number;
}

export class HealthComponent extends Component {
  max: number;
  graphics: PIXI.Graphics;

  private _visibleAmount: number;
  private currentAmount: number;

  constructor(props: IHealthComponent) {
    super();
    this.max = props.max;
    this._visibleAmount = this.max;
    this.currentAmount = this.max;
  }

  start(): void {
    this.graphics = new PIXI.Graphics();
    this._draw();
    this.entity.container.addChild(this.graphics);
  }

  _draw(): void {
    const percentage = this._visibleAmount / this.max;

    this.graphics.clear();

    this.graphics.lineStyle(5, 0x000000, 0.5);
    this.graphics.arc(0, 0, 6, 0, 2 * Math.PI);

    this.graphics.lineStyle({
      width: 5,
      color: 0x00ff00,
      join: PIXI.LINE_JOIN.BEVEL,
    });
    this.graphics.arc(0, 0, 6, 0, 2 * Math.PI * percentage);
    this.graphics.endFill();
  }

  update(delta: number): void {
    const offset = [this.entity.container.width / 2, 0];
    this.graphics.position.set(offset[0], offset[1]);

    this._visibleAmount = Math.lerp(
      this._visibleAmount,
      this.currentAmount,
      0.3 * delta
    );

    if (this.currentAmount === this.max) {
      this.graphics.alpha = Math.lerp(this.graphics.alpha, 0, 0.25 * delta);
    } else {
      this.graphics.alpha = Math.lerp(this.graphics.alpha, 1, 0.8 * delta);
    }

    this._draw();
  }

  set(amount: number) {
    this.currentAmount = Math.clamp(amount, 0, this.max);
  }

  remove(amount: number) {
    this.set(this.currentAmount - amount);
  }

  add(amount: number) {
    this.set(this.currentAmount + amount);
  }

  has(amount: number): boolean {
    return this.currentAmount >= amount;
  }
}
