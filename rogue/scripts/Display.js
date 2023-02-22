import Stats from './vendor/stats.module.js';
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

export default class Display {
  constructor() {
    this.scene = undefined;
    this.lights = [];

    this.camera = undefined;
    this.fov = 75;
    this.nearPlane = 1;
    this.farPlane = 1000;

    this.renderer = undefined;

    // NOTE: Additional components.
    this.controls = undefined;

    this.stats_fps = undefined;
    this.stats_ms = undefined;
    this.stats_mb = undefined;
  }

  initialize() {
    // Stats
    this.stats_fps = new Stats();
    this.stats_fps.showPanel(0); // Panel 0 = fps
    this.stats_fps.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
    this.stats_fps.domElement.style.display = 'inline';
    document.body.appendChild(this.stats_fps.domElement);

    this.stats_ms = new Stats();
    this.stats_ms.showPanel(1); // Panel 1 = ms
    this.stats_ms.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
    this.stats_ms.domElement.style.display = 'none';
    document.body.appendChild(this.stats_ms.domElement);

    this.stats_mb = new Stats();
    this.stats_mb.showPanel(2); // Panel 2 = mb
    this.stats_mb.domElement.style.cssText = 'position:absolute;top:0px;left:160px;';
    this.stats_mb.domElement.style.display = 'none';
    document.body.appendChild(this.stats_mb.domElement);

    // Scene
    this.scene = new THREE.Scene();

    this.lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    this.lights[1] = new THREE.PointLight(0xf0f0f0, 1, 0);
    this.lights[0].position.set(0, 100, 100);
    this.lights[1].position.set(200, 100, 0);
    this.scene.add(this.lights[0]);
    this.scene.add(this.lights[1]);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0.0, 0.0, 0.0);

    // Create a renderer with Antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setClearColor('#101010');
    //this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    //window.requestAnimationFrame(this.animate.bind(this));

    // Render the scene
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    // Update debug
    this.stats_fps.update();
    this.stats_ms.update();
    this.stats_mb.update();
  }
}
