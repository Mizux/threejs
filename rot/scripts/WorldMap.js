//import * as ROT from './rot.js';
import Vector2 as Position from './Vector2.js';

export class MapItem {
  static FLOOR = new MapItem('FLOOR', 0);
  //static WALL = new MapItem('WALL', 1);
  //static BOX = new MapItem('BOX', 2);

  constructor(name, value) {
    this.name = name;
    this.value = value;
    Object.freeze(this);
  }
}

export default class WorldMap {
  #map = null;
  #rooms = null;

  constructor() {
		WorldMap.prototype.isWorldMap = true;
    this.#map = new Map();
  }

  generate() {
    this.#map = new Map();
    this.#generateMap();
  }

  map() {
    return this.#map;
  }

  isWalkable(position) {
    console.assert(position instanceof Position, 'position must be of type Vector2');
    return this.#map.keys().find(k => position.equals(k)) !== undefined;
  }

  #generateMap() {
    const digger = new ROT.Map.Digger();
    const digCallback = function (x, y, value) {
      if (value) {
        return;
      }
      const key = new Position(x, y);
      this.#map.set(key, MapItem.FLOOR);
    };
    digger.create(digCallback.bind(this));
  }
}

