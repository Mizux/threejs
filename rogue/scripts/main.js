import Game from './Game.js';

const game = new Game();
game.start();

// Testing: reset Game every second
function update() {
  game.stop();
  game.reset();
  game.start();
  setTimeout(() => {
    update();
  }, 10000);
}
update();

