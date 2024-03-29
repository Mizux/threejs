// @ts-check
// import * as ROT from './vendor/rot.js';
import InputHandler from './InputHandler.js';
import Render from './Render.js';
import {World} from './World.js';

class State {
  static STARTED = new State('STARTED');
  static STOPPED = new State('STOPPED');
  // static BOX = new MapItem('BOX');

  /** @arg name {string} */
  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export default class Game {
  #state;
  #render;

  /** @param {HTMLElement | null} node */
  constructor(node = null) {
    this.#state = State.STOPPED;
    this.#render = new Render(this);
    if (node === null)
      document.body.appendChild(this.#render.getNode());
    else
      node.appendChild(this.#render.getNode());

    this.input = new InputHandler(this);
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);

    this.world = new World(this, 80, 50);

    this.reset();
  }

  // Control the rendering engine
  start() {
    this.#render.start();
    this.engine.start();
    this.#state = State.STARTED;
  }
  stop() {
    this.engine.lock();
    this.#render.stop();
    this.#state = State.STOPPED;
  }

  reset() {
    const currentState = this.#state;
    if (currentState === State.STARTED) {
      this.stop();
    }
    this.world.generate();
    if (currentState === State.STARTED) {
      this.start();
    }
  }
}
