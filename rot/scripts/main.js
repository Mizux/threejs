import Debug from './Debug.js';
import Game from './Game.js';

const debug = new Debug();
const game = new Game();

function animate() {
  requestAnimationFrame(animate);
  debug.update();
  game.update();
}
animate();

// Testing: reset Game every second
function update() {
  game.reset();
  setTimeout(() => {
    update();
  }, 10000);
}
update();

