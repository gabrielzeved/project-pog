import * as PIXI from "pixi.js";
import { Key } from "ts-keycode-enum";
import { SpritesheetRendererComponent } from "./core/ECS/components/SpritesheetRendererComponent";
import { Entity } from "./core/ECS/Entity";
import { InputSystem } from "./core/Events/InputSystem";
import { Tilemap } from "./core/Tilemap/Tilemap";
import char from "./game/char.json";
import { PlayerComponent } from "./game/components/PlayerComponent";
import { Resources } from "./game/Resources";

export const app = new PIXI.Application({
  width: 512,
  height: 512,
  backgroundColor: 0xffc0cb,
});

export const resources = new Resources();

await new Promise<void>((resolve, reject) => {
  try {
    resources.start(() => {
      resolve();
    });
  } catch {
    reject();
  }
});

export const inputSystem = new InputSystem();

inputSystem.keyboard.import({
  move_up: Key.UpArrow,
  move_down: Key.DownArrow,
  move_left: Key.LeftArrow,
  move_right: Key.RightArrow,
});

const tilemap = new Tilemap();
tilemap.tiles = new Array(32).fill(new Array(32).fill(81));

tilemap.tileset = resources.textures["tileset"];
tilemap.tileSize = [16, 16];
tilemap.draw();
app.stage.addChild(tilemap.container);

const entity = new Entity(app);
entity.addComponent(new PlayerComponent({ speed: 3 }));

entity.addComponent(
  new SpritesheetRendererComponent({
    initialAnimation: "stand_down",
    spritesheetData: char,
    texture: resources.textures["character"],
  })
);
entity.start();

app.ticker.add((delta) => {
  entity.update(delta);

  //INPUT SYSTEM PROCESS NEEDS TO BE ALWAYS AT THE END
  inputSystem.process();
});

document.getElementById("root")!.appendChild(app.view);

app.start();
