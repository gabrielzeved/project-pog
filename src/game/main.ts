import "../core/Math";
import * as PIXI from "pixi.js";
import { Application } from "../core/Application";

export const options = {
  debug: false,
};

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new Application();

app.start();
