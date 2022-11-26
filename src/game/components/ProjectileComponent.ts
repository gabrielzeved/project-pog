import { vec2 } from "gl-matrix";
import { Component } from "../../core/ECS/Component";

export interface IProjectileComponent {
  velocity: number;
  direction: vec2;
  ttl: number;
  extraAngle?: number;
  onDestroy?: () => void;
}

export class ProjectileComponent extends Component {
  time: number = 0;

  constructor(private props: IProjectileComponent) {
    super();
  }

  start(): void {
    this.entity.container.rotation =
      Math.atan2(this.props.direction[1], this.props.direction[0]) +
      (this.props.extraAngle ?? 0);
  }

  update(delta: number): void {
    const { velocity, direction, ttl } = this.props;

    this.time += delta / 60;

    const newPos: vec2 = [0, 0];
    vec2.add(
      newPos,
      [this.entity.container.position.x, this.entity.container.position.y],
      [direction[0] * velocity * delta, direction[1] * velocity * delta]
    );

    this.entity.container.position.set(newPos[0], newPos[1]);

    if (this.time >= ttl) this.entity.destroy();
  }
}
