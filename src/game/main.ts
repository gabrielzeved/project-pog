import "../core/Math";

import * as PIXI from "pixi.js";

import { Key } from "ts-keycode-enum";
import { Application } from "../core/Application";
import { AnimatedSpriteComponent } from "../core/ECS/components/AnimatedSpriteComponent";
import { SpriteComponent } from "../core/ECS/components/SpriteComponent";
import { InputSystem } from "../core/Events/InputSystem";
import { PlayerComponent } from "./components/PlayerComponent";
import { StaminaComponent } from "./components/StaminaComponent";
import char from "./GUMDROP.json";
import { Resources } from "./Resources";

import Stats from "stats.js";
import { Layer2Tilemap } from "../core/Tiled/Tiled";

export const options = {
  debug: false,
};

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new Application({
  backgroundColor: 0xffc0cb,
  resolution: 1,
  width: window.innerWidth,
  height: window.innerHeight,
});

window.addEventListener("resize", resize);
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

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

export const inputSystem = new InputSystem(app);

inputSystem.keyboard.import({
  move_up: Key.W,
  move_down: Key.S,
  move_left: Key.A,
  move_right: Key.D,
  run: Key.Shift,
  attack: Key.Space,
});

const tilemap = app.createEntity();
tilemap.addComponent(
  await Layer2Tilemap(
    resources.maps["teste"].layers[0],
    resources.maps["teste"].tilesets[0]
  )
);

const entity = app.createEntity();
entity.pivot = [0.5, 0.5];
entity.addComponent(new PlayerComponent({ walkSpeed: 2, runSpeed: 4 }));

entity.addComponent(
  new AnimatedSpriteComponent({
    initialAnimation: "IdleSouth",
    spritesheetData: char,
    texture: resources.textures["character"],
    speed: 0.3,
  })
);

entity.addComponent(
  new StaminaComponent({
    max: 100,
  })
);

const tree = app.createEntity();
tree.pivot = [0.5, 1.0];
tree.addComponent(
  new SpriteComponent({
    texture: resources.textures["tree"],
    pivot: new PIXI.Point(0.5, 1.0),
  })
);
tree.container.position.set(300, 300);

app.entities.forEach((e) => e.start());

app.ticker.add((delta) => {
  stats.begin();
  app.entities.forEach((e) => e.update(delta));

  //tree.container.position = app.stage.toLocal(inputSystem.mouse.position);

  //INPUT SYSTEM PROCESS NEEDS TO BE ALWAYS AT THE END
  inputSystem.process();
  stats.end();
});

app.stage.scale.set(1, 1);

document.getElementById("root")!.appendChild(app.view);
app.start();

// if (inputSystem.keyboard.isKey(Key.Space)) {
//   const mousePosition = app.stage.toLocal(inputSystem.mouse.position);
//   const dir: vec2 = [
//     mousePosition.x - entity.position[0],
//     mousePosition.y - entity.position[1],
//   ];
//   vec2.normalize(dir, dir);

//   const effect = app.createEntity();
//   effect.pivot = [0.5, 0.5];

//   effect.addComponent(
//     new AnimatedSpriteComponent({
//       initialAnimation: "default",
//       spritesheetData: effectJson,
//       texture: resources.textures["effect"],
//       speed: 1,
//     })
//   );

//   effect.addComponent(
//     new ProjectileComponent({
//       direction: dir,
//       velocity: 3,
//       ttl: 5,
//       extraAngle: Math.radians(180),
//     })
//   );
//   effect.position = entity.position;
//   effect.container.scale.set(0.6, 0.6);
//   effect.start();
// }

// const editor = new SpritesheetEditor(document.getElementById("editor")!);

// const preview = editor.app.createEntity();
// preview.addComponent(
//   new SpriteRendererComponent({
//     texture: resources.textures["character"],
//   })
// );

// preview.container.pivot.set(0.5, 0.5);

// editor.app.entities.forEach((e) => e.start());
// editor.start();

// preview.container.pivot.set(
//   preview.container.width / 2,
//   preview.container.height / 2
// );

// editor.app.ticker.add((delta) => {
//   editor.app.entities.forEach((e) => e.update(delta));
// });

// var spritesheetConfig = {
//   totalSize: {
//     x: 0,
//     y: 0,
//   },
//   tileSize: {
//     x: 0,
//     y: 0,
//   },
//   count: 0,
//   copyJson: () => {
//     console.log("alo");
//   },
// };

// var gui = new dat.GUI({ autoPlace: false });
// var tileSize = gui.addFolder("Tile Size");
// tileSize.add(spritesheetConfig.tileSize, "x");
// tileSize.add(spritesheetConfig.tileSize, "y");
// var totalSize = gui.addFolder("Total Size");
// totalSize.add(spritesheetConfig.totalSize, "x");
// totalSize.add(spritesheetConfig.totalSize, "y");
// gui.add(spritesheetConfig, "count");
// gui.add(spritesheetConfig, "copyJson");

// const customContainer = document.getElementById("editor")!;
// customContainer.appendChild(gui.domElement);
