// @ts-check
// import * as ROT from './vendor/rot.js';
import {World} from './engine/world.js';
import InputHandler from './ui/input_handler.js';
import Render from './ui/render.js';

class State {
  static STARTED = new State('STARTED');
  static STOPPED = new State('STOPPED');
  // static BOX = new MapItem('BOX');

  name;

  /** @arg name {string} */
  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export default class Game {
  render;
  scheduler;
  engine;
  world;
  #state;

  constructor(node = null) {
    this.#state = State.STOPPED;
    this.render = new Render(this);
    if (node === null)
      document.body.appendChild(this.render.getNode());
    else
      node.appendChild(this.render.getNode());

    this.input = new InputHandler(this);
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);

    this.world = new World(this, 80, 50);

    this.reset();
  }

  // Control the rendering engine
  start() {
    this.render.start();
    this.engine.start();
    this.#state = State.STARTED;
  }
  stop() {
    this.engine.lock();
    this.render.stop();
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
