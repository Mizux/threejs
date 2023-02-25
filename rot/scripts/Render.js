//import * as ROT from './vendor/rot.js';
import Debug from './Debug.js';
import Game from './Game.js';

export default class Render {
  #debug = null;
  #prev = undefined;
  _game = null;

  #callback = null;

  constructor(game) {
    this.#debug = new Debug();

    console.assert(game instanceof Game, 'game must be of type Game');
    this._game = game;

    this.display = new ROT.Display();
  }

  getNode() {
    return this.display.getContainer();
  }

  // Control the rendering engine
  start() {
    this.update();
  }
  stop() {
    if (this.#callback !== null)
      cancelAnimationFrame(this.#callback);
  }

  update(/*timestamp*/) {
    //console.log(timestamp);
    this.#callback = requestAnimationFrame(this.update.bind(this));
    this.#debug.update();

    this.display.clear();
    for (const position of this._game.world.emptyCells()) {
      this.display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('floor')
      );
    }
    for (const position of this._game.world.boxes()) {
      this.display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('box')
      );
    }
    for (const mob of this._game.world.mobs) {
      this.display.draw(
        mob.position.x,
        mob.position.y,
        this.#worldItemToSprite('mob')
      );
    }
    this.display.draw(
      this._game.world.player.position.x,
      this._game.world.player.position.y,
      '@'
    );
  }

  #worldItemToSprite(item) {
    switch (item) {
    case 'floor':
      return '.';
    case 'wall':
      return '#';
    case 'box':
      return '*';
    case 'mob':
      return 'g';
    default:
      return '?';
    }
  }
}
