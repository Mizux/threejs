//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';
import World from './World.js';
import Player from './Player.js';

export default class Game {
  #display = null;
  #world = null;
  #player = null;

  constructor() {
    this.#display = new ROT.Display();
    document.body.appendChild(this.#display.getContainer());

    this.#world = new World();
    this.#player = new Player();

    this.reset();
  }

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

  #draw() {
    this.#display.clear();
    for (const [key, val] of this.#world.map()) {
      this.#display.draw(key.x, key.y, val);
    }
    this.#display.draw(this.#player.x, this.#player.y, '@');
  }
}