export interface IExport {
  format: string;
  target: string;
}

export interface IEditorSetting {
  export: IExport;
}

export type LayerType = "tilelayer" | "objectgroup" | "imagelayer" | "group";

export interface ILayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: LayerType;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  objects: IObject[];
  properties?: IProperty[];
}

export interface IObject {
  class?: string;
  ellipse?: boolean;
  gid: number;
  height: number;
  id: number;
  name: string;
  point?: boolean;
  properties?: IProperty[];
  rotation?: number;
  template?: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface IProperty {
  name: string;
  type:
    | "string"
    | "int"
    | "float"
    | "bool"
    | "color"
    | "file"
    | "object"
    | "class";
  propertytype: string;
  value: any;
}

export interface ITileset {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
}

export interface ITiledFile {
  compressionlevel: number;
  editorsettings: IEditorSetting;
  height: number;
  infinite: boolean;
  layers: ILayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: ITileset[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
}
