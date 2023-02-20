//import * as ROT from './rot.js';
import Vector2 from './Vector2.js';
import Game from './Game.js';

export default class Player extends Vector2 {
  #game = null;

  constructor(game, x=0, y=0) {
    super(x, y);
    console.assert(game instanceof Game, 'game must be of type Game')
    this.#game = game;
  }

  act() {
    this.#game.engine().lock();
    this.#game.inputHandler().subscribe(this);
  }

  handleEvent(value) {
    if (value.length === 2) {
      const newPos = new Vector2(this.x + value[0], this.y + value[1]);
      /* cannot move in this direction */
      if (!this.#game.world().isWalkable(newPos)) {
        console.log("bump wall");
        return;
      } else {
        console.log("Player move to ", newPos);
      }

      this.x = newPos.x;
      this.y = newPos.y;
      this.#game.inputHandler().unsubscribe(this);
      this.#game.engine().unlock();
    }
  }
}
