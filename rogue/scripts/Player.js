import Actor from './Actor.js';
import Vector2 from './Vector2.js';

export default class Player extends Actor {
  constructor(game, position) {
    super(game, position);
  }

  act() {
    //console.log('act...');
    this._game.engine.lock();
    this._game.input.subscribe(this);
  }

  handleEvent(value) {
    if (value.length === 2) {
      const newPos = new Vector2(
        this.position.x + value[0],
        this.position.y + value[1]);
      /* cannot move in this direction */
      if (!this._game.world.isWalkable(newPos)) {
        console.log('bump wall, play again');
        return;
      } else {
        console.log('Player move to ', newPos);
      }

      this.position.x = newPos.x;
      this.position.y = newPos.y;
      this._game.input.unsubscribe(this);
      this._game.engine.unlock();
    }
  }
}
