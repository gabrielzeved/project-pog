import { Assets } from "@pixi/assets";

import manifest from "./manifest.json";

await Assets.init({
  manifest,
});
