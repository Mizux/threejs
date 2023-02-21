//import * as ROT from './rot.js';
import Debug from './Debug.js';
import Game from './Game.js';

export default class Render {
  #debug = null;
  #game = null;
  #display = null;

  #callback = null;

  constructor(game) {
    this.#debug = new Debug();

    console.assert(game instanceof Game, 'game must be of type Game')
    this.#game = game;

    this.#display = new ROT.Display();
  }

  getNode() {
    return this.#display.getContainer();
  }

  // Control the rendering engine
  start() {
    this.update();
  }
  stop() {
    if (this.#callback !== null)
      cancelAnimationFrame(this.#callback);
  }

  update(timestamp) {
    //console.log(timestamp);
    this.#callback = requestAnimationFrame(this.update.bind(this));
    this.#debug.update();

    this.#display.clear();
    for (const position of this.#game.world().emptyCells()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("floor")
      );
    }
    for (const position of this.#game.world().boxes()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("box")
      );
    }
    for (const position of this.#game.world().mobs()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("mob")
      );
    }
    this.#display.draw(
      this.#game.player().position.x,
      this.#game.player().position.y,
      "@"
    );
  }

  #worldItemToSprite(item) {
    switch (item) {
      case "floor":
        return ".";
      case "wall":
        return "#";
      case "box":
        return "*";
      case "mob":
        return "g";
      default:
        return "?";
    }
  }
}
