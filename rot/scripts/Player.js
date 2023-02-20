//import * as ROT from './rot.js';
import Actor from './Actor.js';
import Vector2 from './Vector2.js';

export default class Player extends Actor {
  constructor(game, x=0, y=0) {
    super(game, x, y);
  }

  act() {
    this._game.engine().lock();
    this._game.inputHandler().subscribe(this);
  }

  handleEvent(value) {
    if (value.length === 2) {
      const newPos = new Vector2(this.x + value[0], this.y + value[1]);
      /* cannot move in this direction */
      if (!this._game.world().isWalkable(newPos)) {
        console.log("bump wall, play again");
        return;
      } else {
        console.log("Player move to ", newPos);
      }

      this.x = newPos.x;
      this.y = newPos.y;
      this._game.inputHandler().unsubscribe(this);
      this._game.engine().unlock();
    }
  }
}
