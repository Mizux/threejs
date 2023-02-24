//import * as ROT from './vendor/rot.js';
import Actor from './Actor.js';
import Vector2 from './Vector2.js';

export default class Monster extends Actor {
  constructor(game, position) {
    super(game, position);
  }

  act() {
    this._game.engine.lock();
    const index = Math.floor(ROT.RNG.getUniform() * 8);
    const value = ROT.DIRS[8][index];

    const newPos = new Vector2(
      this.position.x + value[0],
      this.position.y + value[1]
    );
    if (this._game.world.isWalkable(newPos)) {
      this.position.x = newPos.x;
      this.position.y = newPos.y;
    }
    this._game.engine.unlock();
  }
}
