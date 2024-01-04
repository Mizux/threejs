// @ts-check
import Game from '../game.js';

import Vector2 from './vector2.js';

export default class Actor {
  _game;
  position;

  /**
   * @param {Game} game
   * @param {Vector2} position
   */
  constructor(game, position) {
    console.assert(game instanceof Game, 'game must be of type Game');
    console.assert(position instanceof Vector2,
                   'position must be of type Vector2');
    this._game = game;
    this.position = position.clone();
    this._game.scheduler.add(this, true);
  }

  dispose() { this._game.scheduler.remove(this, true); }
}
