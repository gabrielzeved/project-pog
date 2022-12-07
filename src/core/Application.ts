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
import { SpriteComponent } from "./ECS/components/SpriteComponent";

type StageObjects = {
  playerStart: { x: number; y: number };
};

export class Application extends PIXI.Application {
  public entities: Array<Entity> = [];
  private resources: Resources;
  public inputSystem: InputSystem;
  private stats: Stats;
  private stageObjects: StageObjects;

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

  drawUpperTiles() {
    const tilemap = Tilemap.fromTiled(this.resources.maps["teste"]);

    tilemap.layers = tilemap.layers.slice(1);

    const entity = this.createEntity();
    entity.addComponent(tilemap.toComponent());
    entity.container.zIndex = 2;

    // console.log(tilemap.layers, "layers");

    // tilemap.layers.forEach((layer) => {
    //   const tmap = Tilemap.fromTiled(this.resources.maps["teste"]);
    //   const tEntity = this.createEntity();

    //   tmap.layers = [layer];
    //   tEntity.addComponent(tmap.toComponent());

    //   tEntity.container.zIndex = 2;
    // });
  }

  drawLowerTiles() {
    const tilemap = Tilemap.fromTiled(this.resources.maps["teste"]);
    const objects = tilemap.layers.find(
      (layer) => layer.type === "objectgroup"
    )?.objects;

    // get only lower tiles
    tilemap.layers = tilemap.layers.slice(0, 1);

    const tilemapEntity = this.createEntity();
    tilemapEntity.addComponent(tilemap.toComponent());

    // Set up player initial position
    if (objects) {
      const playerStart = objects.find((obj) => obj.name === "player-start");

      if (playerStart) {
        this.stageObjects = {
          playerStart: {
            x: playerStart.x,
            y: playerStart.y,
          },
        };
      }
    }
  }

  drawObjects() {
    const tree = this.createEntity();

    tree.pivot = [0.5, 1.0];
    tree.addComponent(
      new SpriteComponent({
        texture: this.resources.textures["tree"],
        pivot: new PIXI.Point(0.5, 1.0),
      })
    );
    tree.container.position.set(300, 300);
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

    /* Map Stuff */
    this.drawLowerTiles();
    this.drawObjects();
    this.spawnPlayer();
    this.drawUpperTiles();

    //   this.stage.children.sort(function(a,b) {
    //     a.y = a.y || 0 ;
    //     b.y = b.y || 0;
    //     return a.y - b.y;
    // });

    // this.entities.sort(
    //   (a: Entity, b: Entity) => b.container.zIndex - a.container.zIndex
    // );
    // console.log(this.entities);

    // Start this after all entities are created
    this.entities.forEach((entity) => entity.start());

    console.log(this.stage.children);

    /* Game Loop */
    this.ticker.add((delta) => {
      this.stats.begin();

      this.entities.forEach((e) => e.update(delta));

      this.stage.children.sort(function (a, b) {
        const nx = 0;
        const ny = 1;

        if (a.zIndex === 2) {
          if (b.zIndex === 1.01) {
            // console.log(b); // Player
            console.log(a, "tile container"); // Upper Tile Container
            return (
              b.position.x * nx +
              b.position.y * ny -
              (b.position.x * nx + b.position.y * ny)
            );
          } else {
            return 0;
          }
        }

        return (
          a.position.x * nx +
          a.position.y * ny -
          (b.position.x * nx + b.position.y * ny)
        );
      });

      // INPUT SYSTEM PROCESS NEEDS TO BE ALWAYS AT THE END
      this.inputSystem.process();
      this.stats.end();
    });
  }

  spawnPlayer() {
    const entity = this.createEntity();
    entity.pivot = [0.5, 0.5];
    entity.addComponent(new PlayerComponent({ walkSpeed: 2, runSpeed: 4 }));
    entity.container.zIndex = 1.01;
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

    if (this?.stageObjects?.playerStart) {
      entity.container.position.set(
        this.stageObjects.playerStart.x,
        this.stageObjects.playerStart.y
      );
    }
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
