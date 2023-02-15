import Stats from './stats.module.js';

export default class Debug {
 #fps = null;
 #mb = null;
 #ms = null;

 constructor() {
   this.#fps = new Stats();
   this.#fps.showPanel(0); // Panel 0 = fps
   this.#fps.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
   this.#fps.domElement.style.display = "inline";
   document.body.appendChild(this.#fps.domElement);

   this.#mb = new Stats();
   this.#mb.showPanel(2); // Panel 2 = mb
   this.#mb.domElement.style.cssText = "position:absolute;top:0px;left:80px;";
   this.#mb.domElement.style.display = "inline";
   document.body.appendChild(this.#mb.domElement);

   this.#ms = new Stats();
   this.#ms.showPanel(1); // Panel 1 = ms
   this.#ms.domElement.style.cssText = "position:absolute;top:0px;left:160px;";
   this.#ms.domElement.style.display = "none";
   document.body.appendChild(this.#ms.domElement);
 }

 update() {
  this.#fps.update();
  this.#mb.update();
  this.#ms.update();
 }
}

