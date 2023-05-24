// @ts-check
import Game from './Game.js';
import Vector2 from './Vector2.js';

export default class Actor {
  _game;
  position;

  /**
   * @param {Game} game
   * @param {Vector2} position
   */
  constructor(game, position) {
    this._game = game;
    this.position = position.clone();
    this._game.scheduler.add(this, true);
  }

  dispose() {
    this._game.scheduler.remove(this, true);
  }
}
