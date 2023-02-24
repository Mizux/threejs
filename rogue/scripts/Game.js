//import * as ROT from './vendor/rot.js';
import Vector2 from "./Vector2.js";
import Render from "./Render.js";
import InputHandler from "./InputHandler.js";
import { World } from "./World.js";
import Player from "./Player.js";
class State {
  static STARTED = new State("STARTED");
  static STOPPED = new State("STOPPED");
  //static BOX = new MapItem('BOX');

  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export default class Game {
  #render = null;

  #inputHandler = null;

  #scheduler = null;
  #engine = null;
  #state = null;

  #world = null;
  #player = null;

  constructor(node = null) {
    this.#render = new Render(this);
    if (node === null) document.body.appendChild(this.#render.getNode());
    else node.appendChild(this.#render.getNode());

    this.#inputHandler = new InputHandler(this);

    this.#scheduler = new ROT.Scheduler.Simple();
    this.#engine = new ROT.Engine(this.#scheduler);
    this.#state = State.STOPPED;

    this.#world = new World(this, 80, 50);
    this.#player = new Player(this, new Vector2());

    this.reset();
  }

  // Control the rendering engine
  start() {
    this.#render.start();
    this.#engine.start();
    this.#state = State.STARTED;
  }
  stop() {
    //this.#engine.stop();
    this.#render.stop();
    this.#state = State.STOPPED;
  }

  inputHandler() {
    return this.#inputHandler;
  }

  scheduler() {
    return this.#scheduler;
  }
  engine() {
    return this.#engine;
  }

  world() {
    return this.#world;
  }
  player() {
    return this.#player;
  }

  reset() {
    const currentState = this.#state;

    if (currentState === State.STARTED) {
      this.stop();
    }
    this.#world.generate();
    this.#placePlayer();
    if (currentState === State.STARTED) {
      this.start();
    }
  }

  #placePlayer() {
    const cells = this.#world.emptyCells();
    const index = Math.floor(ROT.RNG.getUniform() * cells.length);
    const position = cells.splice(index, 1)[0];
    this.#player.position.x = position.x;
    this.#player.position.y = position.y;
  }
}
