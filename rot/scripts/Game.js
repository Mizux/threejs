//import * as ROT from './rot.js';
import Vector2 from "./Vector2.js";
import InputHandler from "./InputHandler.js";
import { WorldItem, World } from "./World.js";
import Player from "./Player.js";

export default class Game {
  #display = null;
  #inputHandler = null;
  #world = null;
  #player = null;
  #engine = null;

  constructor() {
    this.#display = new ROT.Display();
    document.body.appendChild(this.#display.getContainer());

    this.#inputHandler = new InputHandler(this);

    this.#world = new World(this);
    this.#player = new Player(this);

    this.reset();

    const scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.#player, true);
    this.#engine = new ROT.Engine(scheduler);
    this.#engine.start();
  }

  display() {
    return this.#display;
  }
  inputHandler() {
    return this.#inputHandler;
  }
  world() {
    return this.#world;
  }
  player() {
    return this.#player;
  }
  engine() {
    return this.#engine;
  }

  reset() {
    this.#world.generate();
    this.#placePlayer();
    this.#draw();
  }

  update() {
    this.#draw();
  }

  #placePlayer() {
    const cells = this.#world.freeCells();
    const index = Math.floor(ROT.RNG.getUniform() * cells.length);
    const position = cells.splice(index, 1)[0];
    this.#player.x = position.x;
    this.#player.y = position.y;
  }

  #worldItemToSprite(item) {
    switch (item) {
      case "floor":
        return ".";
      case "wall":
        return "#";
      case "box":
        return "*";
      case "mob":
        return "g";
      default:
        return "?";
    }
  }

  #draw() {
    this.#display.clear();
    for (const position of this.#world.freeCells()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("floor")
      );
    }
    for (const position of this.#world.boxes()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("box")
      );
    }
    for (const position of this.#world.mobs()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite("mob")
      );
    }
    this.#display.draw(this.#player.x, this.#player.y, "@");
  }
}
