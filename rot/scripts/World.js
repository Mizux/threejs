//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';

export default class World {
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
    const tmp = [...this.#map].filter(([k, v]) => v === '.');
    return Array.from(tmp, ([k, v]) => k);
  }

  boxes() {
    const tmp = [...this.#map].filter(([k, v]) => v === '*');
    return Array.from(tmp, ([k, v]) => k);
  }

  #generateMap() {
    const digger = new ROT.Map.Digger();
    const digCallback = function (x, y, value) {
      if (value) {
        return;
      }
      const key = new Vector2(x, y);
      this.#map.set(key, '.');
    };
    digger.create(digCallback.bind(this));
  }

  #generateBoxes() {
    const cells = this.freeCells();
    for (let i = 0; i < 24; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const key = cells.splice(index, 1)[0];
      this.#map.set(key, '*');
    }
  }
}