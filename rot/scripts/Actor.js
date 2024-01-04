// @ts-check
import Game from './Game.js';
import Vector2 from './Vector2.js';

export default class Actor {
  _game;
  position;

  constructor(game, position) {
    console.assert(game instanceof Game, 'game must be of type Game');
    this._game = game;
    console.assert(position instanceof Vector2,
                   'position must be of type Vector2');
    this.position = position.clone();

    this._game.scheduler.add(this, true);
  }

  dispose() { this._game.scheduler.remove(this, true); }
}
