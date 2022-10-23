import * as PIXI from "pixi.js";
import { SpritesheetRendererComponent } from "./core/ECS/components/SpritesheetRendererComponent";
import { Entity } from "./core/ECS/Entity";
import { InputSystem } from "./core/Events/InputSystem";
import char from "./game/char.json";
import { Resources } from "./game/Resources";

export const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0xffc0cb,
});

const inputSystem = new InputSystem();

const entity = new Entity(app);

app.ticker.add(() => {
  inputSystem.process();
});

document.getElementById("root")!.appendChild(app.view);

export const resources = new Resources();

resources.start(() => {
  entity.addComponent(new SpritesheetRendererComponent(char));
  entity.start();
});

app.start();
