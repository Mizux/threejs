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
    /* wait for user input; do stuff when user hits a key */
    window.addEventListener("keydown", this);
  }

  handleEvent(e) {
    const keyMap = {};
    keyMap[38] = 0; // ArrowUp (8)
    keyMap[33] = 1; // PageUp (9)
    keyMap[39] = 2; // ArrowRight (6)
    keyMap[34] = 3; // PageDown (3)
    keyMap[40] = 4; // ArrowDown (2)
    keyMap[35] = 5; // End (1)
    keyMap[37] = 6; // ArrowLeft (4)
    keyMap[36] = 7; // Home (7)
    //keyMap[12] = ; // Clear (5)
    const code = e.keyCode;
    if (!(code in keyMap)) { return; }

    const diff = ROT.DIRS[8][keyMap[code]];
    const newPos = new Vector2(this.x + diff[0], this.y + diff[1]);

    /* cannot move in this direction */
    if (!this.#game.world().isWalkable(newPos)) {
      console.log("bump wall");
      return;
    }
    this.x = newPos.x;
    this.y = newPos.y;
    window.removeEventListener("keydown", this);
    this.#game.engine().unlock();
  }
}

