//import * as ROT from './vendor/rot.js';
import Debug from './Debug.js';
import Game from './Game.js';
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

export default class Render {
  #debug = null;
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
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.scene.add(this.group);

    const box_geometry = new THREE.BoxGeometry(1, 1, 1);
    const box_material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, flatShading: true });
    const box = new THREE.Mesh(box_geometry, box_material);
    this.group.add(box);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    this.group.add(new THREE.LineSegments(box_geometry, lineMaterial));

    this.update();
  }
  stop() {
    if (this.#callback !== null)
      cancelAnimationFrame(this.#callback);

    // cleanup objects
  }

  update(/*timestamp*/) {
    //console.log(timestamp);
    this.#callback = requestAnimationFrame(this.update.bind(this));
    this.#debug.update();

    this.group.rotateX(0.003);
    this.group.rotateY(0.005);
    this.group.rotateZ(0.007);
      
    this.group.position.x = this._game.player().position.x;
    this.group.position.y = this._game.player().position.y;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    
    /*
    this.#display.clear();
    for (const position of this._game.world().emptyCells()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('floor')
      );
    }
    for (const position of this._game.world().boxes()) {
      this.#display.draw(
        position.x,
        position.y,
        this.#worldItemToSprite('box')
      );
    }
    for (const position of this._game.world().mobs()) {
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

  #initialize() {
    // Scene
    this.scene = new THREE.Scene();

    this.lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    this.lights[1] = new THREE.PointLight(0xf0f0f0, 1, 0);
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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // if window resizes
    window.addEventListener('resize', () => this.#onWindowResize(), false);
  }

  #onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
