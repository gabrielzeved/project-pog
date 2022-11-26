export class FiniteStateMachine {
  _states: Record<string, Newable<State>>;
  _currentState: State | null;

  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _addState(name: string, type: Newable<State>) {
    this._states[name] = type;
  }

  setState(name: string) {
    const prevState = this._currentState;
    if (prevState?.locked) return;

    if (prevState) {
      if (prevState.name == name) {
        return;
      }
      prevState.exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.enter(prevState);
  }

  update(timeElapsed: number, action: string) {
    const shouldChangeState = this._currentState?.edges.some((edge) => {
      const name = Object.entries(this._states).find(
        (entry) => entry[1] === edge
      )?.[0];
      return name === action;
    });

    if (shouldChangeState) {
      this.setState(action);
    }

    if (this._currentState) {
      this._currentState.update(timeElapsed);
    }
  }
}

export abstract class State {
  _parent: FiniteStateMachine;
  abstract name: string;
  abstract edges: Newable<State>[];
  locked: boolean = false;

  constructor(parent: FiniteStateMachine) {
    this._parent = parent;
  }

  abstract enter(prevState: State | null): void;
  abstract exit(): void;
  abstract update(timeElapsed: number): void;
}
