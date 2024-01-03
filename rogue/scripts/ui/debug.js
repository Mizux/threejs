// @ts-check
import Stats from '../vendor/stats.module.js';

export default class Debug {
  #fps;
  #mb;
  #ms;

  constructor() {
    this.#fps = new Stats();
    this.#fps.showPanel(0);  // Panel 0 = fps
    this.#fps.dom.style.cssText = 'position:absolute;top:0px;left:0px;';
    this.#fps.dom.style.display = 'inline';
    document.body.appendChild(this.#fps.dom);

    this.#mb = new Stats();
    this.#mb.showPanel(2);  // Panel 2 = mb
    this.#mb.dom.style.cssText = 'position:absolute;top:0px;left:80px;';
    this.#mb.dom.style.display = 'inline';
    document.body.appendChild(this.#mb.dom);

    this.#ms = new Stats();
    this.#ms.showPanel(1);  // Panel 1 = ms
    this.#ms.dom.style.cssText = 'position:absolute;top:0px;left:160px;';
    this.#ms.dom.style.display = 'none';
    document.body.appendChild(this.#ms.dom);
  }

  update() {
    this.#fps.update();
    this.#mb.update();
    this.#ms.update();
  }
}
