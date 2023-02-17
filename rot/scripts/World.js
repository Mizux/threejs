//import * as ROT from './rot.js';
import {Vector2 as Position} from './Vector2.js';
import WorldMap from './WorldMap.js';

export class WorldItem {
  static BOX = new WorldItem('BOX', 0);

  constructor(name, value) {
    this.name = name;
    this.value = value;
    Object.freeze(this);
  }
}

export class World {
  #worldMap = null;
  #items = null;

  constructor() {
    this.#worldMap = new WorldMap();
    this.items = [];
    this.generate();
  }

  generate() {
    this.#worldMap.generate();
    this.#generateBoxes();
  }

  map() {
    return this.#worldMap;
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

  #generateBoxes(numBox=24) {
    this.#items = this.#items.filter(p => )
    const cells = this.freeCells();
    for (let i = 0; i < numBox; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const key = cells.splice(index, 1)[0];
      this.#map.set(key, WorldItem.BOX);
    }
  }
}

