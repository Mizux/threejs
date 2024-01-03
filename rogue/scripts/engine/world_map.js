// @ts-check
// import * as ROT from './vendor/rot.js';
import Vector2 from './vector2.js';

export class MapItem {
  static FLOOR = new MapItem('FLOOR');
  // static WALL = new MapItem('WALL');
  // static BOX = new MapItem('BOX');

  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export class WorldMap {
  #map;
  #rooms;

  constructor(width, height) {
    WorldMap.prototype.isWorldMap = true;
    this.width = width;
    this.height = height;
    this.#map = new Map();
    this.#rooms = null;
  }

  generate() {
    this.#map = new Map();
    this.#generateMap();
  }

  floors() {
    const locations = [];
    this.#map.forEach((type, position) => {
      if (type === MapItem.FLOOR) locations.push(position);
    });
    return locations;
  }

  isWalkable(position) {
    console.assert(
        position instanceof Vector2, 'position must be of type Vector2');
    return [...this.#map.keys()].find(k => position.equals(k)) !== undefined;
  }

  #generateMap() {
    const digger = new ROT.Map.Digger(this.width, this.height);
    const digCallback = function(x, y, value) {
      if (value) {
        return;
      }
      const key = new Vector2(x, y);
      this.#map.set(key, MapItem.FLOOR);
    };
    digger.create(digCallback.bind(this));
  }
}
