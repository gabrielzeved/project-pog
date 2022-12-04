import "../core/Math";

import * as PIXI from "pixi.js";

import { Assets } from "@pixi/assets";
import { Stage } from "@pixi/layers";
import GUI from "lil-gui";
import Stats from "stats.js";
import { Key } from "ts-keycode-enum";
import { Application } from "../core/Application";
import { ColliderComponent } from "../core/ECS/components/ColliderComponent";
import { AnimatedSpriteComponent } from "../core/ECS/components/sprites/AnimatedSpriteComponent";
import { TilemapColliderComponent } from "../core/ECS/components/tilemap/TilemapColliderComponent";
import { LayerManager } from "../core/Layer/LayerManager";
import { Tilemap } from "../core/Tiled/Tiled";
import { PlayerComponent } from "./components/player/PlayerComponent";
import { StaminaComponent } from "./components/StaminaComponent";
import "./Resources/Resources";

import { DamagableComponent } from "./components/DamagableComponent";
import char from "./GUMDROP.json";
import enemyJSON from "./octonid.json";

const gui = new GUI();

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

export const layerManager = new LayerManager();
layerManager.add("root", 0);

app.stage = new Stage();
app.stage.addChild(layerManager.get("root"));

app.inputSystem.keyboard.import({
  move_up: Key.W,
  move_down: Key.S,
  move_left: Key.A,
  move_right: Key.D,
  run: Key.Shift,
  attack: Key.Space,
});

const maps = await Assets.loadBundle("maps");
const sprites = await Assets.loadBundle("sprites");

const tilemap = Tilemap.fromTiled(maps.teste);

const tilemapE = app.createEntity();
tilemapE.addComponent(tilemap.toComponent());
tilemapE.addComponent(new TilemapColliderComponent());

const entity = app.createEntity();
entity.pivot = [0.5, 0.5];
entity.addComponent(new PlayerComponent({ walkSpeed: 2, runSpeed: 4 }));

entity.addComponent(
  new AnimatedSpriteComponent({
    initialAnimation: "IdleSouth",
    spritesheetData: char,
    texture: sprites.character,
    speed: 0.3,
  })
);

const damagable = new DamagableComponent({
  healthBarSize: [50, 10],
  maxHealth: 100,
});

entity.addComponent(damagable);

entity.addComponent(
  new StaminaComponent({
    max: 100,
  })
);

entity.addComponent(
  new ColliderComponent({
    rect: new PIXI.Rectangle(-8, 4, 16, 8),
  })
);

const enemy = app.createEntity();
enemy.pivot = [0.5, 0.5];
enemy.addComponent(
  new AnimatedSpriteComponent({
    initialAnimation: "IdleSouth",
    spritesheetData: enemyJSON,
    texture: sprites.enemy,
    speed: 0.3,
  })
);
enemy.addComponent(
  new ColliderComponent({
    rect: new PIXI.Rectangle(-12, -4, 24, 16),
  })
);
enemy.container.position.set(150, 150);

entity.container.position.set(100, 100);
entity.container.zOrder = 1;

gui.add(enemy.container, "x").listen();
gui.add(enemy.container, "y").listen();

gui.add(damagable, "health", 0, 100, 1).listen();

for (let i = 0; i < 100; i++) {
  const collide = app.createEntity();
  collide.addComponent(
    new ColliderComponent({
      rect: new PIXI.Rectangle(0, 0, 32, 32),
    })
  );
  collide.container.position.set(Math.random() * 800, Math.random() * 800);
}

app.entities.forEach((e) => e.start());

app.ticker.add((delta) => {
  stats.begin();
  app.entities.forEach((e) => e.update(delta));

  //tree.container.position = app.stage.toLocal(inputSystem.mouse.position);

  //INPUT SYSTEM PROCESS NEEDS TO BE ALWAYS AT THE END
  app.inputSystem.process();
  stats.end();
});

app.stage.scale.set(1, 1);

document.getElementById("root")!.appendChild(app.view);
app.start();
