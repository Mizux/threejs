// @ts-check
import Game from './game.js';

const game = new Game();
game.start();

// Leak Testing: reset Game
function update() {
  game.reset();
  setTimeout(() => { update(); }, 10 * 1000);
}
update();
