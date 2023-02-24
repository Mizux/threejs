//import * as ROT from './vendor/rot.js';
import Debug from './Debug.js';
import Game from './Game.js';
import * as THREE from './vendor/three.module.js';
//import { OrbitControls } from './vendor/OrbitControls.js';

export default class Render {
  #debug = null;
  #prev = undefined;
  _game = null;

  #callback = null;

  constructor(game) {
    this.#debug = new Debug();

    console.assert(game instanceof Game, 'game must be of type Game');
    this._game = game;

    this.scene = null;
    this.lights = [];

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
    // Reset Camera position
    this.camera.position.set(
      this._game.world.map.width / 2,
      this._game.world.map.height / 2,
      64
    );
    this.camera.lookAt(
      this._game.world.map.width / 2,
      this._game.world.map.height / 2,
      0
    );

    // Reset light positions
    this.lights[0].position.set(
      this.camera.position.x,
      this.camera.position.y,
      150
    );
    this.lights[1].position.set(
      this._game.world.player.position.x,
      this._game.world.player.position.y,
      10
    );

    // # Create World
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);
    // ## Create Floors
    const floors = this._game.world.map.floors();
    //console.log(floors)
    for (let i = 0; i < floors.length; ++i) {
      const planeGeometry = new THREE.PlaneGeometry(1, 1);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x010101,
        emissive: 0x101010,
        flatShading: true,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.x = floors[i].x;
      plane.position.y = floors[i].y;
      this.worldGroup.add(plane);
    }

    // ## Create Player
    this.playerGroup = new THREE.Group();
    this.scene.add(this.playerGroup);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      flatShading: true,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.playerGroup.add(box);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    this.playerGroup.add(new THREE.LineSegments(boxGeometry, lineMaterial));
    this.playerGroup.position.set(this._game.world.player.position);

    this.#callback = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    if (this.#callback !== null) {
      cancelAnimationFrame(this.#callback);
      this.#callback = null;
    }
    this.#prev = undefined;

    // cleanup objects
    const meshes = [];
    const lines = [];
    this.scene.traverse(function (object) {
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
    this.scene.remove(this.playerGroup);
    this.scene.remove(this.worldGroup);
  }

  update(t) {
    const dt = this.#getDeltaT(t);

    //console.log(t);
    this.#callback = requestAnimationFrame(this.update.bind(this));
    this.#debug.update();
    // Light
    this.lights[1].position.set(
      this._game.world.player.position.x,
      this._game.world.player.position.y,
      3
    );

    this.playerGroup.rotateX(0.003 * dt);
    this.playerGroup.rotateY(0.005 * dt);
    this.playerGroup.rotateZ(0.007 * dt);

    this.playerGroup.position.x = this._game.world.player.position.x;
    this.playerGroup.position.y = this._game.world.player.position.y;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
    //this.controls.update();

    /*
    this.#display.clear();
    for (const position of this._game.world.emptyCells()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('floor')
      );
    }
    for (const position of this._game.world.boxes()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('box')
      );
    }
    for (const position of this._game.world.mobs()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('mob')
      );
    }
    this.#display.draw(
      this._game.player().position.x,
      this._game.player().position.y,
      '@'
    );
    */
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

    this.lights[0] = new THREE.PointLight(0x804000, 0.2, 0);
    this.lights[1] = new THREE.PointLight(0xffff00, 5, 0, 0.01);
    this.lights[0].position.set(0, 0, 75);
    this.lights[1].position.set(20, 0, 0);
    this.scene.add(this.lights[0]);
    this.scene.add(this.lights[1]);

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
