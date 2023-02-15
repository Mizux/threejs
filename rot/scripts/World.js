//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';

export class WorldItem {
  static FLOOR = new WorldItem('FLOOR', 0);
  static WALL = new WorldItem('WALL', 1);
  static BOX = new WorldItem('BOX', 2);

  constructor(name, value) {
    this.name = name;
    this.value = value;
    Object.freeze(this);
  }
}

export class World {
  #map = null;

  constructor() {
    this.#map = new Map();
  }

  generate() {
    this.#map = new Map();
    this.#generateMap();
    this.#generateBoxes();
  }

  map() {
    return this.#map;
  }

  freeCells() {
    const res = [];
    this.#map.forEach((v, k) => { if (v === WorldItem.FLOOR) res.push(k); });
    return res;
  }

  boxes() {
    const res = [];
    this.#map.forEach((v, k) => { if (v === WorldItem.BOX) res.push(k); });
    return res;
  }

  isWalkable(position) {
    console.assert(position instanceof Vector2, 'position must be of type Vector2');
    let value = undefined;
    this.#map.forEach((v, k) => {
       if (k.x === position.x && k.y === position.y)
         value = v;
    });
    if (value === WorldItem.FLOOR) return true;
    if (value === WorldItem.BOX) return true;
    return false;
  }

  #generateMap() {
    const digger = new ROT.Map.Digger();
    const digCallback = function (x, y, value) {
      if (value) {
        return;
      }
      const key = new Vector2(x, y);
      this.#map.set(key, WorldItem.FLOOR);
    };
    digger.create(digCallback.bind(this));
  }

  #generateBoxes(numBox=24) {
    const cells = this.freeCells();
    for (let i = 0; i < numBox; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const key = cells.splice(index, 1)[0];
      this.#map.set(key, WorldItem.BOX);
    }
  }
}

