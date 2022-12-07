import { vec2 } from "gl-matrix";
import { Component } from "../../core/ECS/Component";
import { AnimatedSpriteComponent } from "../../core/ECS/components/AnimatedSpriteComponent";
import { MouseButton } from "../../core/Events/Mouse/MouseSystem";
import { CharacterFSM } from "../player/CharacterFMS";
import { StaminaComponent } from "./StaminaComponent";
import { app } from "../main";

interface PlayerComponentProps {
  walkSpeed: number;
  runSpeed: number;
}

export class PlayerComponent extends Component {
  direction: vec2 = [0, 0];
  spritesheet: AnimatedSpriteComponent;
  stamina: StaminaComponent;
  stateMachine: CharacterFSM;
  facing: "South" | "North" | "East" | "West" = "South";

  constructor(private props: PlayerComponentProps) {
    super();
    this.stateMachine = new CharacterFSM(this);
    this.stateMachine.setState("idle");
  }

  start() {
    this.spritesheet = this.entity.getComponent<AnimatedSpriteComponent>(
      AnimatedSpriteComponent
    );
    this.stamina = this.entity.getComponent<StaminaComponent>(StaminaComponent);
  }

  update(delta: number) {
    this.movement(delta);
  }

  canMove(): boolean {
    const preventWalkStates = ["attack", "attackB"];

    return !preventWalkStates.includes(
      this.stateMachine._currentState?.name ?? ""
    );
  }

  movement(delta: number) {
    let { walkSpeed, runSpeed } = this.props;

    const isRunning = app.inputSystem.keyboard.isKey("run");

    let direction: vec2 = [0, 0];
    let position: vec2 = [
      this.entity.container.position.x,
      this.entity.container.position.y,
    ];

    if (app.inputSystem.keyboard.isKey("move_down"))
      vec2.add(direction, direction, [0, 1]);
    if (app.inputSystem.keyboard.isKey("move_up"))
      vec2.add(direction, direction, [0, -1]);
    if (app.inputSystem.keyboard.isKey("move_left"))
      vec2.add(direction, direction, [-1, 0]);
    if (app.inputSystem.keyboard.isKey("move_right"))
      vec2.add(direction, direction, [1, 0]);

    vec2.normalize(direction, direction);

    let action;

    if (vec2.equals(direction, [0, 0])) {
      action = "idle";
    } else {
      action = isRunning ? "run" : "walk";
    }

    const faceDirection = this.getDirection(direction);
    if (faceDirection) this.facing = faceDirection;

    if (app.inputSystem.mouse.isButtonDown(MouseButton.LEFT)) action = "attack";

    this.stateMachine.update(delta, action);

    let speed = isRunning ? runSpeed : walkSpeed;

    if (!this.canMove()) return;

    this.direction = direction;

    vec2.add(position, position, [
      this.direction[0] * speed * delta,
      this.direction[1] * speed * delta,
    ]);

    this.entity.container.position.set(position[0], position[1]);
  }

  getDirection(direction: vec2): "South" | "North" | "East" | "West" | "" {
    if (direction[0] < 0) return "West";
    else if (direction[0] > 0) return "East";
    else if (direction[1] > 0) return "South";
    else if (direction[1] < 0) return "North";
    return "";
  }

  // const mousePosition: vec2 = [
  //   inputSystem.mouse.position.x,
  //   inputSystem.mouse.position.y,
  // ];
  // const lookAtAngle = Math.atan2(
  //   mousePosition[1] - position[1],
  //   mousePosition[0] - position[0]
  // );

  // const degree = Math.degrees(lookAtAngle);
  // const lookAtDirection = this.getDirection(this.direction);
  // console.log(degree);

  // getDirectionByAngle(angle: number): string {
  //   if (angle < -45 && angle > -135) return "up";
  //   if (angle < 135 && angle > 45) return "down";
  //   if (angle < -135 || angle > 135) return "left";
  //   if (angle > -45 || angle < 45) return "right";
  //   return "";
  // }
}
