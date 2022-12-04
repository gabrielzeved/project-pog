import { vec2 } from "gl-matrix";
import { Graphics } from "pixi.js";
import { Component } from "../../core/ECS/Component";

interface DamagableComponentProps {
  maxHealth: number;
  healthBarSize: vec2;
}

export class DamagableComponent extends Component {
  private maxHealth: number;
  private currentHealth: number;
  private graphics: Graphics;

  public get health() {
    return this.currentHealth;
  }

  public set health(amount: number) {
    this.set(amount);
  }

  constructor(public props: DamagableComponentProps) {
    super();
    this.maxHealth = props.maxHealth;
    this.currentHealth = this.maxHealth;
  }

  start(): void {
    this.graphics = new Graphics();
    this.entity.container.addChild(this.graphics);
    this.draw();
  }

  update() {
    this.draw();
  }

  draw() {
    const [width, height] = this.props.healthBarSize;
    const offset = [(this.entity.container.width - width) / 2, -15];
    this.graphics.position.set(offset[0], offset[1]);

    const percentage = this.currentHealth / this.maxHealth;

    this.graphics.clear();
    this.graphics.beginFill(0x000000, 0.5);
    this.graphics.drawRect(0, 0, width, height);
    this.graphics.endFill();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(0, 0, width * percentage, height);
    this.graphics.endFill();
  }

  set(amount: number): void {
    this.currentHealth = Math.clamp(amount, 0, this.maxHealth);
    this.draw();
  }
}
