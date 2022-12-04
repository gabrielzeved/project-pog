import { vec2 } from "gl-matrix";
import * as PIXI from "pixi.js";
import { layerManager } from "../../game/main";
import { Application } from "../Application";

import { Component, ComponentClass } from "./Component";
import { ComponentContainer } from "./ComponentContainer";

export class Entity {
  private static _entityCounter = 0;
  private _id: number;
  public parentApp: Application;
  private componentContainer: ComponentContainer;
  public container: PIXI.Container;

  private _pivot: vec2 = [0, 0];

  public get id(): number {
    return this._id;
  }

  public get position(): vec2 {
    return [this.container.position.x, this.container.position.y];
  }

  public set position(value: vec2) {
    this.container.position.set(value[0], value[1]);
  }

  public get pivot(): vec2 {
    return [
      this._pivot[0] * this.container.getLocalBounds().width,
      this._pivot[1] * this.container.getLocalBounds().height,
    ];
  }

  public set pivot(value: vec2) {
    this._pivot = value;
  }

  constructor(public app: Application) {
    Entity._entityCounter++;
    this._id = Entity._entityCounter;
    this.componentContainer = new ComponentContainer();
    this.container = new PIXI.Container();
    this.container.parentLayer = layerManager.get("root");
    this.parentApp = app;
    app.stage.addChild(this.container);
  }

  start() {
    this.componentContainer.getAll().forEach((component) => {
      component.start();
    });
  }

  update(delta: number) {
    this.container.pivot.set(this.pivot[0], this.pivot[1]);
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

  destroy() {
    this.componentContainer.getAll().forEach((component) => {
      component.destroy();
    });
    this.app.entities = this.app.entities.filter((e) => e !== this);
  }
}
