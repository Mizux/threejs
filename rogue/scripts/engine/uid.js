// @ts-check
export default class UID {
  static #id = 0;
  static get() { return this.#id++; }
}
