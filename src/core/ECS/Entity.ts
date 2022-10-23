import * as PIXI from "pixi.js";

import { Component, ComponentClass } from "./Component";
import { ComponentContainer } from "./ComponentContainer";

export class Entity {
  private static _entityCounter = 0;
  private _id: number;
  private componentContainer: ComponentContainer;
  public container: PIXI.Container;

  public get id(): number {
    return this._id;
  }

  constructor(app: PIXI.Application) {
    Entity._entityCounter++;
    this._id = Entity._entityCounter;
    this.componentContainer = new ComponentContainer();
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);
  }

  start() {
    this.componentContainer.getAll().forEach((component) => {
      component.start();
    });
  }

  update(delta: number) {
    this.componentContainer.getAll().forEach((component) => {
      component.update(delta);
    });
  }

  public getComponent<T extends Component>(
    componentClass: ComponentClass<T>
  ): T {
    return this.componentContainer.get(componentClass);
  }

  addComponent(component: Component) {
    component.entity = this;
    this.componentContainer.add(component);
  }

  removeComponent(componentClass: ComponentClass<any>) {
    this.componentContainer.remove(componentClass);
  }
}
