import * as PIXI from "pixi.js";
import { Resources } from "../game/Resources";
import { Entity } from "./ECS/Entity";
import { InputSystem } from "./Events/InputSystem";
import { Key } from "ts-keycode-enum";
import { Tilemap } from "./Tiled/Tiled";
import Stats from "stats.js";
import { PlayerComponent } from "../game/components/PlayerComponent";
import { AnimatedSpriteComponent } from "./ECS/components/AnimatedSpriteComponent";
import { StaminaComponent } from "../game/components/StaminaComponent";
import char from "../game/GUMDROP.json";

export class Application extends PIXI.Application {
  public entities: Array<Entity> = [];
  private resources: Resources;
  public inputSystem: InputSystem;
  private stats: Stats;

  constructor() {
    super({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
      backgroundColor: 0xffc0cb,
    });

    this.stage.scale.set(1, 1);

    document.getElementById("root")!.appendChild(this.view); // Create Canvas tag in the body

    this.inputSystem = new InputSystem(this);
    this.events();
    this.init();
  }

  async init() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.resources = new Resources();

    const resourcesLoaded = await this.resources.tryInit();

    if (resourcesLoaded) {
      this.draw();
    }
  }

  draw() {
    this.inputSystem.keyboard.import({
      move_up: Key.W,
      move_down: Key.S,
      move_left: Key.A,
      move_right: Key.D,
      run: Key.Shift,
      attack: Key.Space,
    });

    const tilemap = Tilemap.fromTiled(this.resources.maps["teste"]);

    const tilemapE = this.createEntity();
    tilemapE.addComponent(tilemap.toComponent());

    this.spawnPlayer();

    this.entities.forEach((entity) => entity.start());

    this.ticker.add((delta) => {
      this.stats.begin();
      this.entities.forEach((e) => e.update(delta));

      // INPUT SYSTEM PROCESS NEEDS TO BE ALWAYS AT THE END
      this.inputSystem.process();
      this.stats.end();
    });
  }

  spawnPlayer() {
    const entity = this.createEntity();
    entity.pivot = [0.5, 0.5];
    entity.addComponent(new PlayerComponent({ walkSpeed: 2, runSpeed: 4 }));

    entity.addComponent(
      new AnimatedSpriteComponent({
        initialAnimation: "IdleSouth",
        spritesheetData: char,
        texture: this.resources.textures["character"],
        speed: 0.3,
      })
    );

    entity.addComponent(
      new StaminaComponent({
        max: 100,
      })
    );
  }

  events() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    this.renderer.resize(window.innerWidth, window.innerHeight);
  }

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }
}
