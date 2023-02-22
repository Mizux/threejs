//import * as ROT from './rot.js';
import Game from './Game.js';

export default class InputHandler {
  #game = null;
  #keyMap = null;
  #subscribers = null;

  constructor(game) {
    console.assert(game instanceof Game, 'game must be of type Game');
    this.#game = game;

    this.#keyMap = {};
    this.#keyMap[38] = ROT.DIRS[8][0]; // ArrowUp (8)
    this.#keyMap[33] = ROT.DIRS[8][1]; // PageUp (9)
    this.#keyMap[39] = ROT.DIRS[8][2]; // ArrowRight (6)
    this.#keyMap[34] = ROT.DIRS[8][3]; // PageDown (3)
    this.#keyMap[40] = ROT.DIRS[8][4]; // ArrowDown (2)
    this.#keyMap[35] = ROT.DIRS[8][5]; // End (1)
    this.#keyMap[37] = ROT.DIRS[8][6]; // ArrowLeft (4)
    this.#keyMap[36] = ROT.DIRS[8][7]; // Home (7)
    
    //keyMap[12] = ; // Clear (5)
    
    this.#subscribers = [];
    document.addEventListener('keydown', this, false);
  }

  handleEvent(e) {
    //console.log('handleEvent: ', e);
    if (this.#subscribers.length === 0) {return;}

    const code = e.keyCode;
    if (!(code in this.#keyMap)) {return;}

    const value = this.#keyMap[code];
    //console.log('subscribers: ', this.#subscribers.length);
    this.#subscribers.forEach(s => s.handleEvent(value));    
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }

  subscribe(subscriber) {
    console.assert(typeof subscriber.handleEvent === 'function', 'subscriber don\'t provide a handleEvent()');
    this.unsubscribe(subscriber); // avoid multi-subscriptions
    this.#subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.#subscribers = this.#subscribers.filter(it => it !== subscriber);
  }
}
