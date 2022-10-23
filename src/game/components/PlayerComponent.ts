import { vec2 } from "gl-matrix";
import { Component } from "../../core/ECS/Component";
import { SpritesheetRendererComponent } from "../../core/ECS/components/SpritesheetRendererComponent";
import { inputSystem } from "../../main";

interface PlayerComponentProps {
  speed: number;
}

export class PlayerComponent extends Component {
  constructor(private props: PlayerComponentProps) {
    super();
  }

  update(delta: number) {
    this.movement(delta);
  }

  movement(delta: number) {
    const { speed } = this.props;
    const spritesheet = this.entity.getComponent<SpritesheetRendererComponent>(
      SpritesheetRendererComponent
    );

    let direction: vec2 = [0, 0];
    let position: vec2 = [
      this.entity.container.position.x,
      this.entity.container.position.y,
    ];

    if (inputSystem.keyboard.isKey("move_down"))
      vec2.add(direction, direction, [0, 1]);
    if (inputSystem.keyboard.isKey("move_up"))
      vec2.add(direction, direction, [0, -1]);
    if (inputSystem.keyboard.isKey("move_left"))
      vec2.add(direction, direction, [-1, 0]);
    if (inputSystem.keyboard.isKey("move_right"))
      vec2.add(direction, direction, [1, 0]);

    vec2.normalize(direction, direction);

    if (direction[0] === 0 && direction[1] === 0) {
      const animation = spritesheet.currentAnimation;
      if (animation.startsWith("walk")) {
        const [_, animationDir] = animation.split("_");
        spritesheet.changeAnimation(`stand_${animationDir}`);
      }
      return;
    }

    if (direction[1] > 0) spritesheet.changeAnimation("walk_down");
    else if (direction[1] < 0) spritesheet.changeAnimation("walk_up");
    else if (direction[0] < 0) spritesheet.changeAnimation("walk_left");
    else if (direction[0] > 0) spritesheet.changeAnimation("walk_right");

    vec2.add(position, position, [
      direction[0] * speed * delta,
      direction[1] * speed * delta,
    ]);

    this.entity.container.position.set(position[0], position[1]);
  }
}
