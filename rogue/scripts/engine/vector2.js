// @ts-check
export default class Vector2 {
  x;
  y;

  constructor(x = 0, y = 0) {
    // Vector2.prototype.isVector2 = true;

    this.x = x;
    this.y = y;
    this.isVector2 = true;
  }

  get width() { return this.x; }

  set width(value) { this.x = value; }

  get height() { return this.y; }

  set height(value) { this.y = value; }

  /**
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * @param {number} scalar
   */
  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;

    return this;
  }

  /**
   * @param {number} x
   */
  setX(x) {
    this.x = x;

    return this;
  }

  /**
   * @param {number} y
   */
  setY(y) {
    this.y = y;

    return this;
  }

  /**
   * @param {string} index
   * @param {number} value
   */
  setComponent(index, value) {
    switch (index) {
    case 0:
      this.x = value;
      break;
    case 1:
      this.y = value;
      break;
    default:
      throw new Error('index is out of range: ' + index);
    }

    return this;
  }

  /**
   * @param {string} index
   */
  getComponent(index) {
    switch (index) {
    case 0:
      return this.x;
    case 1:
      return this.y;
    default:
      throw new Error('index is out of range: ' + index);
    }
  }

  clone() { return new this.constructor(this.x, this.y); }

  /**
   * @param {{ x: number; y: number; }} v
   */
  copy(v) {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  /**
   * @param {number} s
   */
  addScalar(s) {
    this.x += s;
    this.y += s;

    return this;
  }

  /**
   * @param {{ x: any; y: any; }} a
   * @param {{ x: any; y: any; }} b
   */
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   * @param {number} s
   */
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  /**
   * @param {number} s
   */
  subScalar(s) {
    this.x -= s;
    this.y -= s;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} a
   * @param {{ x: number; y: number; }} b
   */
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  }

  /**
   * @param {number} scalar
   */
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  divide(v) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  /**
   * @param {number} scalar
   */
  divideScalar(scalar) { return this.multiplyScalar(1 / scalar); }

  /**
   * @param {{ elements: any; }} m
   */
  applyMatrix3(m) {
    const x = this.x, y = this.y;
    const e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6];
    this.y = e[1] * x + e[4] * y + e[7];

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} min
   * @param {{ x: number; y: number; }} max
   */
  clamp(min, max) {
    // assumes min < max, componentwise

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));

    return this;
  }

  /**
   * @param {number} minVal
   * @param {number} maxVal
   */
  clampScalar(minVal, maxVal) {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));

    return this;
  }

  /**
   * @param {number} min
   * @param {number} max
   */
  clampLength(min, max) {
    const length = this.length();

    return this.divideScalar(length || 1)
        .multiplyScalar(Math.max(min, Math.min(max, length)));
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  roundToZero() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  dot(v) { return this.x * v.x + this.y * v.y; }

  /**
   * @param {{ y: number; x: number; }} v
   */
  cross(v) { return this.x * v.y - this.y * v.x; }

  lengthSq() { return this.x * this.x + this.y * this.y; }

  length() { return Math.sqrt(this.x * this.x + this.y * this.y); }

  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y); }

  normalize() { return this.divideScalar(this.length() || 1); }

  angle() {
    // computes the angle in radians with respect to the positive x-axis

    const angle = Math.atan2(-this.y, -this.x) + Math.PI;

    return angle;
  }

  /**
   * @param {any} v
   */
  distanceTo(v) { return Math.sqrt(this.distanceToSquared(v)); }

  /**
   * @param {{ x: number; y: number; }} v
   */
  distanceToSquared(v) {
    const dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  manhattanDistanceTo(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  /**
   * @param {any} length
   */
  setLength(length) { return this.normalize().multiplyScalar(length); }

  /**
   * @param {{ x: number; y: number; }} v
   * @param {number} alpha
   */
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v1
   * @param {{ x: number; y: number; }} v2
   * @param {number} alpha
   */
  lerpVectors(v1, v2, alpha) {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} v
   */
  equals(v) { return v.x === this.x && v.y === this.y; }

  /**
   * @param {number[]} array
   */
  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];

    return this;
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;

    return array;
  }

  /**
   * @param {{ getX: (arg0: any) => number; getY: (arg0: any) => number; }}
   *     attribute
   * @param {any} index
   */
  fromBufferAttribute(attribute, index) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);

    return this;
  }

  /**
   * @param {{ x: number; y: number; }} center
   * @param {number} angle
   */
  rotateAround(center, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);

    const x = this.x - center.x;
    const y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;

    return this;
  }

  random() {
    this.x = Math.random();
    this.y = Math.random();

    return this;
  }

  key() { return `${this.x},${this.y}`; }

  * [ Symbol.iterator ]() {
    yield this.x;
    yield this.y;
  }
}
