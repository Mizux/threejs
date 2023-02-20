//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';
import Game from './Game.js';

export default class Actor extends Vector2 {
  _game = null;

  constructor(game, x=0, y=0) {
    super(x, y);
    console.assert(game instanceof Game, 'game must be of type Game')
    this._game = game;
    this._game.scheduler().add(this, true);
  }

  dispose() {
    this._game.scheduler().remove(this, true);
  }
}
