// @ts-check
// import * as ROT from './vendor/rot.js';
import Game from '../game.js';

import Monster from './monster.js';
import Player from './player.js';
import Vector2 from './vector2.js';
import {WorldMap} from './world_map.js';

export class WorldItem {
  static OBJ = new WorldItem('OBJECT');
  static BOX = new WorldItem('BOX');
  static MOB = new WorldItem('MOB');

  /**@param {string} name - Name of the Item.*/
  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export class World {
  #game;

  /**@param {Game} game*/
  constructor(game, width, height) {
    console.assert(game instanceof Game, 'game must be of type Game');
    this.#game = game;

    this.map = new WorldMap(width, height);
    this.items = new Map();
    this.mobs = [];
    this.player = new Player(this.#game, new Vector2());
  }

  generate() {
    this.map.generate();
    this.#generateBoxes();
    this.#generateMobs();
    this.#placePlayer();
  }

  emptyCells() {
    let locations = this.map.floors();
    locations = locations.filter(position => !(position in this.items.keys()));
    return locations;
  }

  isWalkable(position) { return this.map.isWalkable(position); }

  boxes() {
    const locations = [];
    this.items.forEach((type, position) => {
      if (type === WorldItem.BOX)
        locations.push(position);
    });
    return locations;
  }

  #removeItemByType(type) {
    console.assert(type instanceof WorldItem, 'type must be of type WorldItem');
    this.items.forEach((v, k) => {
      if (v === type)
        this.items.delete(k);
    });
  }

  #generateBoxes(numBox = 64) {
    this.#removeItemByType(WorldItem.BOX);
    const cells = this.emptyCells();
    for (let i = 0; i < numBox; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const position = cells.splice(index, 1)[0];
      this.items.set(position, WorldItem.BOX);
    }
  }

  #generateMobs(numMob = 8) {
    this.#removeItemByType(WorldItem.MOB);
    this.mobs.forEach(m => m.dispose());
    this.mobs.length = 0;

    const cells = this.emptyCells();
    for (let i = 0; i < numMob; i++) {
      const index = Math.floor(ROT.RNG.getUniform() * cells.length);
      const position = cells.splice(index, 1)[0];
      this.items.set(position, WorldItem.MOB);
      this.mobs.push(new Monster(this.#game, position));
    }
  }

  #placePlayer() {
    const cells = this.emptyCells();
    const index = Math.floor(ROT.RNG.getUniform() * cells.length);
    const position = cells.splice(index, 1)[0];
    this.player.position.x = position.x;
    this.player.position.y = position.y;
  }
}
