import * as ROT from './rot.js';

class Game {
  #display = null;
  #map = null;

  constructor() {
    this.#display = new ROT.Display();
    document.body.appendChild(this.#display.getContainer());

    this.reset();
  }

  reset() {
    this.#generateMap();
    this.#drawWholeMap();
  }

  #generateMap() {
    this.#map = new Map();

    const digger = new ROT.Map.Digger();
    const freeCells = [];
    const digCallback = function (x, y, value) {
      if (value) {
        return;
      }
      const key = `${x},${y}`;
      this.#map.set(key, ".");
      freeCells.push(key);
    };
    digger.create(digCallback.bind(this));
    this.#generateBoxes(freeCells);
  }

  #generateBoxes(freeCells) {
    for (var i = 0; i < 24; i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.#map.set(key, "*");
    }
  }

  #drawWholeMap() {
    for (const key of this.#map.keys()) {
      const parts = key.split(",");
      const x = parseInt(parts[0]);
      const y = parseInt(parts[1]);
      this.#display.draw(x, y, this.#map.get(key));
    }
  }
}

const g = new Game();

function update() {
  g.reset();
  setTimeout(() => {
    update();
  }, 5000);
}

update();
