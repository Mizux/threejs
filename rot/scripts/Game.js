//import * as ROT from './rot.js';
import Vector2 from "./Vector2.js";
import Render from "./Render.js";
import InputHandler from "./InputHandler.js";
import { WorldItem, World } from "./World.js";
import Player from "./Player.js";

export default class Game {
  #render = null;

  #inputHandler = null;

  #scheduler = null;
  #engine = null;

  #world = null;
  #player = null;

  constructor(node = null) {
    this.#render = new Render(this);
    if (node === null)
      document.body.appendChild(this.#render.getNode());
    else
      node.appendChild(this.#render.getNode());

    this.#inputHandler = new InputHandler(this);

    this.#scheduler = new ROT.Scheduler.Simple();
    this.#engine = new ROT.Engine(this.#scheduler);

    this.#world = new World(this);
    this.#player = new Player(this, new Vector2());

    this.reset();
  }

  // Control the rendering engine
  start() {
    this.#render.start();
    this.#engine.start();
  }
  stop() {
    //this.#engine.stop();
    this.#render.stop();
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
    this.#world.generate();
    this.#placePlayer();
  }

  #placePlayer() {
    const cells = this.#world.emptyCells();
    const index = Math.floor(ROT.RNG.getUniform() * cells.length);
    const position = cells.splice(index, 1)[0];
    this.#player.position.x = position.x;
    this.#player.position.y = position.y;
  }
}
