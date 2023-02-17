//import * as ROT from './rot.js';
import { WorldMap, MapItem } from './WorldMap.js';

export class WorldItem {
  static OBJ = new WorldItem('OBJECT');
  static BOX = new WorldItem('BOX');
  static MOB = new WorldItem('MOB');

  constructor(name, value) {
    this.name = name;
    Object.freeze(this);
  }
}

export class World {
  #worldMap = null;
  #items = null;

  constructor() {
    this.#worldMap = new WorldMap();
    this.#items = new Map();
    this.generate();
  }

  generate() {
    this.#worldMap.generate();
    this.#generateBoxes();
    this.#generateMobs();
  }

  freeCells() {
    let locations = this.#worldMap.floors();
    locations = locations.filter(position => !(position in this.#items.keys()));
    return locations;
  }

  isWalkable(position) {
    return this.#worldMap.isWalkable(position);
  }

  boxes() {
    const locations = [];
    this.#items.forEach((type, position) => {
      if (type === WorldItem.BOX) locations.push(position); });
    return locations;
  }

  mobs() {
    const locations = [];
    this.#items.forEach((type, position) => {
      if (type === WorldItem.MOB) locations.push(position);
    });
    return locations;
  }

  #removeItemByType(type) {
    console.assert(type instanceof WorldItem, 'type must be of type WorldItem');
    this.#items.forEach((v, k) => { if (v === type) this.#items.delete(k);});
  }
   
  #generateBoxes(numBox=24) {
    this.#removeItemByType(WorldItem.BOX);
    const cells = this.freeCells();
    for (let i = 0; i < numBox; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const position = cells.splice(index, 1)[0];
      this.#items.set(position, WorldItem.BOX);
    }
  }
   
  #generateMobs(numMob=5) {
    this.#removeItemByType(WorldItem.MOB);
    const cells = this.freeCells();
    for (let i = 0; i < numMob; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const position = cells.splice(index, 1)[0];
      this.#items.set(position, WorldItem.MOB);
    }
  }
}

