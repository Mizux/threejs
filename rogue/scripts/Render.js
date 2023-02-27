//import * as ROT from './vendor/rot.js';
import Debug from './Debug.js';
import Game from './Game.js';
import * as THREE from './vendor/three.module.js';
//import { OrbitControls } from './vendor/OrbitControls.js';
import Vector2 from './Vector2.js';

class Entity {
  game = null;
  position = null;
  root = null;

  constructor(game, position) {
    console.assert(game instanceof Game, 'game must be of type Game');
    this.game = game;

    console.assert(
      position instanceof Vector2,
      'position must be of type Vector2'
    );
    this.position = position;

    this.root = new THREE.Group();
    this.root.position.set(position);
    game.render.scene.add(this.root);
  }

  update(/*t, dt*/) {}

  dispose() {
    const meshes = [];
    const lines = [];
    this.root.traverse(function (object) {
      if (object.isMesh) meshes.push(object);
      if (object.isLine) lines.push(object);
    });
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      mesh.material.dispose();
      mesh.geometry.dispose();
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      line.material.dispose();
    }

    this.game.render.scene.remove(this.root);
    this.root = null;
  }
}
class FloorEntity extends Entity {
  constructor(game, position) {
    super(game, position);

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x010101,
      emissive: 0x101010,
      flatShading: true,
    });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.castShadow = false;
    this.plane.receiveShadow = false;
    this.root.add(this.plane);

    this.root.position.x = position.x;
    this.root.position.y = position.y;
  }
}

class BoxEntity extends Entity {
  constructor(game, position) {
    super(game, position);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    boxGeometry.scale(1, 1, 0.25);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x000020,
      emissive: 0x000020,
      flatShading: true,
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.box.castShadow = false;
    this.box.receiveShadow = false;
    this.root.add(this.box);

    this.root.position.x = position.x;
    this.root.position.y = position.y;
  }
}

class PlayerEntity extends Entity {
  constructor(game, position) {
    super(game, position);

    this.light = new THREE.PointLight(0xffffff, 1, 0, 0.02);
    //this.light.castShadow = true;
    this.light.position.set(0, 0, 2);
    this.root.add(this.light);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    boxGeometry.scale(0.7, 0.7, 0.7);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      flatShading: true,
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.box.castShadow = false; //default is false
    this.box.receiveShadow = false; //default
    this.root.add(this.box);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    this.line = new THREE.LineSegments(boxGeometry, lineMaterial);
    this.root.add(this.line);

    this.root.position.z = 0.7;
  }

  update(t, dt) {
    this.box.rotateX(0.003 * dt);
    this.box.rotateY(0.005 * dt);
    this.box.rotateZ(0.007 * dt);

    this.line.rotateX(0.003 * dt);
    this.line.rotateY(0.005 * dt);
    this.line.rotateZ(0.007 * dt);

    this.root.position.x = this.position.x;
    this.root.position.y = this.position.y;
  }
}
class MonsterEntity extends Entity {
  constructor(game, position) {
    super(game, position);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    boxGeometry.scale(0.5, 0.5, 0.5);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x008000,
      emissive: 0x008000,
      flatShading: true,
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.box.castShadow = false; //default is false
    this.box.receiveShadow = false; //default
    this.root.add(this.box);

    this.root.position.z = 0.5;
  }

  update(t, dt) {
    this.box.rotateX(0.003 * dt);
    this.box.rotateY(0.005 * dt);
    this.box.rotateZ(0.007 * dt);

    this.root.position.x = this.position.x;
    this.root.position.y = this.position.y;
  }
}
class State {
  static STARTED = new State('STARTED');
  static PAUSED = new State('PAUSED');
  static STOPPED = new State('STOPPED');
  constructor(name) {
    this.name = name;
    Object.freeze(this);
  }
}

export default class Render {
  #state = null;
  #debug = null;
  #prev = undefined;

  #callback = null;
  #entities = [];

  constructor(game) {
    this.#state = State.STOPPED;
    this.#debug = new Debug();

    console.assert(game instanceof Game, 'game must be of type Game');
    this.game = game;

    this.scene = null;
    this.lightTarget = null;
    this.light = null;

    this.camera = null;
    this.fov = 75;
    this.nearPlane = 1;
    this.farPlane = 1000;

    this.renderer = null;
    // NOTE: Additional components.
    this.controls = null;

    this.#initialize();
  }

  getNode() {
    return this.renderer.domElement;
  }

  // Control the rendering engine
  start() {
    if (this.#state === State.STARTED) return;
    else this.#state = State.STARTED;

    // Reset Camera position
    const map = this.game.world.map;
    const p =
      Math.max(map.width, map.height) /
      2 /
      Math.tan(((this.fov / 2) * Math.PI) / 180);
    this.camera.position.set(map.width / 2, map.height / 6, p);
    this.camera.lookAt(map.width / 2, map.height / 2, 0);

    // Reset light positions
    this.lightTarget.position.set(map.width / 2, map.height / 2, 0);
    this.light.position.set(map.width / 2, map.height / 2, p);

    // # Create World
    // ## Create Floors
    const floors = this.game.world.map.floors();
    for (let i = 0; i < floors.length; ++i) {
      const floor = new FloorEntity(this.game, floors[i]);
      this.#entities.push(floor);
    }

    // ## Create Player
    const player = new PlayerEntity(this.game, this.game.world.player.position);
    this.#entities.push(player);

    // ## Create Mobs
    const mobs = this.game.world.mobs;
    for (let i = 0; i < mobs.length; ++i) {
      const mob = new MonsterEntity(this.game, mobs[i].position);
      this.#entities.push(mob);
    }

    // ## Create boxes
    const boxes = this.game.world.boxes();
    for (let i = 0; i < boxes.length; ++i) {
      const box = new BoxEntity(this.game, boxes[i]);
      this.#entities.push(box);
    }

    this.#callback = requestAnimationFrame(this.update.bind(this));
  }

  pause() {
    if (this.#state === State.PAUSED || this.#state === State.STOPPED) return;
    else this.#state = State.PAUSED;

    if (this.#callback !== null) {
      cancelAnimationFrame(this.#callback);
      this.#callback = null;
      this.#prev = undefined;
    }
  }

  stop() {
    if (this.#state === State.STOPPED) return;
    else this.#state = State.STOPPED;

    if (this.#callback !== null) {
      cancelAnimationFrame(this.#callback);
      this.#callback = null;
      this.#prev = undefined;
    }

    // cleanup objects
    this.#entities.forEach((e) => e.dispose());
    this.#entities.length = 0;
  }

  update(t) {
    this.#callback = requestAnimationFrame(this.update.bind(this));
    this.#debug.update();

    //console.log(t);
    const dt = this.#getDeltaT(t);
    this.#entities.forEach((e) => e.update(t, dt));

    // Render the scene
    this.renderer.render(this.scene, this.camera);
    //this.controls.update();
  }

  #getDeltaT(t) {
    if (this.#prev === undefined) {
      this.#prev = t;
    }
    const dt = t - this.#prev;
    this.#prev = t;
    return dt;
  }

  #initialize() {
    // Scene
    this.scene = new THREE.Scene();

    this.lightTarget = new THREE.Object3D();
    this.scene.add(this.lightTarget);
    this.light = new THREE.DirectionalLight(0xf0f0f0, 2);
    //this.light.castShadow = true;
    this.light.position.set(0, 0, 75);
    this.light.target = this.lightTarget;
    this.scene.add(this.light);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.set(0, 0, 75);
    this.camera.lookAt(0.0, 0.0, 0.0);

    // Create a renderer with Antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setClearColor('#101010');

    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // if window resizes
    window.addEventListener('resize', () => this.#onWindowResize(), false);
  }

  #onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
