import Debug from './Debug.js';
import Game from './Game.js';

const d = new Debug();
const g = new Game();

function update() {
  g.reset();
  setTimeout(() => {
    update();
  }, 1000);
}
update();

function animate() {
  requestAnimationFrame(animate);
  d.update();
  g.update();
}
animate();