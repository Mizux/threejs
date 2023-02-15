//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';
import {WorldItem, World} from './World.js';
import Player from './Player.js';

export default class Game {
  #display = null;
  #world = null;
  #player = null;
  #engine = null;

  constructor() {
    this.#display = new ROT.Display();
    document.body.appendChild(this.#display.getContainer());

    this.#world = new World(this);
    this.#player = new Player(this);

    this.reset();

    const scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.#player, true);
    this.#engine = new ROT.Engine(scheduler);
    this.#engine.start();
  }

  display() { return this.#display; }
  world() { return this.#world; }
  player() { return this.#player; }
  engine() { return this.#engine; }

  reset() {
    this.#world.generate();
    this.#placePlayer();
    this.#draw();
  }

  update() {
    this.#draw();
  }

  #placePlayer() {
    const cells = this.#world.freeCells();
    const index = Math.floor(ROT.RNG.getUniform() * cells.length);
    const key = cells.splice(index, 1)[0];
    this.#player.x = key.x;
    this.#player.y = key.y;
  }

  #worldItemToSprite(item) {
    console.assert(item instanceof WorldItem, 'item must be of type WorldItem')
    switch(item) {
      case WorldItem.FLOOR:
        return '.';
      case WorldItem.WALL:
        return '#';
      case WorldItem.BOX:
        return 'B';
      default:
        return '?';
    }
  }

  #draw() {
    this.#display.clear();
    for (const [key, val] of this.#world.map()) {
      this.#display.draw(key.x, key.y, this.#worldItemToSprite(val));
    }
    this.#display.draw(this.#player.x, this.#player.y, '@');
  }
}

