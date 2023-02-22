import Game from './Game.js';

const game = new Game();
game.start();

// Testing: reset Game every second
function update() {
  game.reset();
  setTimeout(() => {
    update();
  }, 10000);
}
update();

