import { MouseButton } from "../../core/Events/Mouse/MouseSystem";
import {
  FiniteStateMachine,
  State,
} from "../../core/StateMachine/StateMachine";
import { PlayerComponent } from "../components/PlayerComponent";
import { inputSystem } from "../main";

export class CharacterFSM extends FiniteStateMachine {
  component: PlayerComponent;

  constructor(component: PlayerComponent) {
    super();
    this.component = component;

    this._addState("idle", IdleState);
    this._addState("walk", WalkState);
    this._addState("run", RunState);
    this._addState("attack", AttackState);
    this._addState("attackB", AttackBState);
    this._addState("attackC", AttackCState);
  }
}

abstract class AnimationState extends State {
  declare _parent: CharacterFSM;

  lockUntilFinished: boolean = false;
  shouldUpdateDirection: boolean = true;
  abstract animationPrefix: string;

  _playAnimation() {
    const direction = this._parent.component.facing;

    if (direction)
      this._parent.component.spritesheet.changeAnimation(
        `${this.animationPrefix}${direction}`
      );
  }

  update(_: number): void {
    if (this.shouldUpdateDirection) this._playAnimation();
  }
  enter(): void {
    if (!this.lockUntilFinished) return;

    this._playAnimation();

    this._parent.component.spritesheet.sprite.loop = false;
    this._parent.component.spritesheet.sprite.onComplete =
      this.onComplete.bind(this);
    this.locked = true;
  }

  exit(): void {
    this._parent.component.spritesheet.sprite.loop = true;
    this._parent.component.spritesheet.sprite.onComplete = undefined;
  }
  onComplete(): void {
    this.locked = false;
  }
}

class IdleState extends AnimationState {
  animationPrefix: string = "Idle";
  edges: Newable<State>[] = [RunState, WalkState, AttackState];

  constructor(parent: CharacterFSM) {
    super(parent);
  }

  get name() {
    return "idle";
  }

  update(delta: number): void {
    super.update(delta);
    this._parent.component.stamina.add(1 * delta);
  }
}

class WalkState extends AnimationState {
  declare _parent: CharacterFSM;
  edges: Newable<State>[] = [IdleState, RunState, AttackState];
  animationPrefix: string = "Walk";
  constructor(parent: CharacterFSM) {
    super(parent);
  }

  get name() {
    return "walk";
  }

  update(delta: number): void {
    super.update(delta);
    this._parent.component.stamina.add(0.5 * delta);
  }
}

class RunState extends AnimationState {
  declare _parent: CharacterFSM;
  edges: Newable<State>[] = [IdleState, WalkState, AttackState];
  animationPrefix: string = "Run";

  constructor(parent: CharacterFSM) {
    super(parent);
  }

  get name() {
    return "run";
  }
}

class AttackState extends AnimationState {
  declare _parent: CharacterFSM;
  edges: Newable<State>[] = [RunState, IdleState, WalkState];
  animationPrefix: string = "AttackA";

  waitFrame: boolean = false;
  shouldCombo: boolean = false;

  staminaCost: number = 10;

  constructor(parent: CharacterFSM) {
    super(parent);
    this.lockUntilFinished = true;
    this.shouldUpdateDirection = false;
  }

  get name() {
    return "attack";
  }

  enter(): void {
    if (!this._parent.component.stamina.has(this.staminaCost)) {
      this.onComplete();
    } else {
      super.enter();
      this._parent.component.stamina.remove(this.staminaCost);
    }
  }

  onComplete(): void {
    super.onComplete();
    if (this.shouldCombo) this._parent.setState("attackB");
  }

  update(delta: number): void {
    super.update(delta);
    if (this.waitFrame && inputSystem.mouse.isButtonDown(MouseButton.LEFT))
      this.shouldCombo = true;
    this.waitFrame = true;
  }
}

class AttackBState extends AnimationState {
  declare _parent: CharacterFSM;
  edges: Newable<State>[] = [RunState, IdleState, WalkState];
  animationPrefix: string = "AttackB";

  waitFrame: boolean = false;
  shouldCombo: boolean = false;

  staminaCost: number = 30;

  constructor(parent: CharacterFSM) {
    super(parent);
    this.lockUntilFinished = true;
    this.shouldUpdateDirection = false;
  }

  get name() {
    return "attackB";
  }

  enter(): void {
    if (!this._parent.component.stamina.has(this.staminaCost)) {
      this.onComplete();
    } else {
      super.enter();
      this._parent.component.stamina.remove(this.staminaCost);
    }
  }

  onComplete(): void {
    super.onComplete();
    if (this.shouldCombo) this._parent.setState("attackC");
  }

  update(delta: number): void {
    super.update(delta);
    if (this.waitFrame && inputSystem.mouse.isButtonDown(MouseButton.LEFT))
      this.shouldCombo = true;
    this.waitFrame = true;
  }
}

class AttackCState extends AnimationState {
  declare _parent: CharacterFSM;
  edges: Newable<State>[] = [RunState, IdleState, WalkState];
  animationPrefix: string = "AttackC";

  staminaCost: number = 50;

  enter(): void {
    if (!this._parent.component.stamina.has(this.staminaCost)) {
      this.onComplete();
    } else {
      super.enter();
      this._parent.component.stamina.remove(this.staminaCost);
    }
  }

  constructor(parent: CharacterFSM) {
    super(parent);
    this.lockUntilFinished = true;
    this.shouldUpdateDirection = false;
  }

  get name() {
    return "attackC";
  }
}
