//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';
import Game from './Game.js';

export default class Actor {
  position = null;
  _game = null;

  constructor(game, position) {
    console.assert(game instanceof Game, 'game must be of type Game');
    this._game = game;
    console.assert(position instanceof Vector2, 'position must be of type Vector2');
    this.position = position;

    this._game.scheduler().add(this, true);
  }

  dispose() {
    this._game.scheduler().remove(this, true);
  }
}
