// @ts-check
import Stats from './vendor/stats.module.js';
import * as THREE from './vendor/three.module.js';
import * as DAT from './vendor/dat.gui.module.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Create an empty scene
const scene = new THREE.Scene();
const lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[0].position.set(0, 500, 100);
scene.add(lights[0]);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[1].position.set(250, 250, 0);
scene.add(lights[1]);

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
  /*FOV=*/75,
  /*aspect=*/window.innerWidth / window.innerHeight,
  /*near=*/0.1,
  /*far=*/1000);
camera.position.set(0, 50, 100);
camera.lookAt(0.0, 0.0, 0.0);

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.toneMapping = THREE.ACESFilmicToneMapping;
//renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor('#101010');
// Append Renderer to DOM
document.body.prepend(renderer.domElement);

// Resize Event
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------
const plane_geometry = new THREE.PlaneGeometry(1000, 500, 10, 10);
plane_geometry.rotateX(-Math.PI / 2);
//const plane_material = new THREE.MeshBasicMaterial({ color: "grey" });
const plane_material = new THREE.MeshPhongMaterial({ color: '#101010', flatShading: false });
const plane = new THREE.Mesh(plane_geometry, plane_material);
scene.add(plane);

const model = new THREE.Group();
const box_geometry = new THREE.BoxGeometry(30, 30, 30);
const box_material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, flatShading: true });
const cube = new THREE.Mesh(box_geometry, box_material);
model.add(cube);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
model.add(new THREE.LineSegments(box_geometry, lineMaterial));
model.position.set(0, 25, 0);
scene.add(model);


/*
// Button stuff
const newBtn = document.createElement('button');
newBtn.innerHTML = 'Do something';
newBtn.id = 'btn';
document.body.appendChild(newBtn);

function dosomething() {
}
document.getElementById('btn')?.addEventListener('click', dosomething);
*/

// GUI Stuff
const params = {
  scene: {
    bg: '#000000'
  },
  model: 0
};

function updateParams() {
  scene.background = new THREE.Color(params.scene.bg);

  //setModel(params.model);
}

// First define DAT.Gui instances
const gui = new DAT.GUI({ load: JSON });
// must be call before gui construction
//gui.remember(params);

//gui.add(param, 'percent', 0, 100, 1).onChange(redraw);

const sceneGUI = gui.addFolder('Scene');
sceneGUI.addColor(params.scene, 'bg').onChange(updateParams);
//sceneGUI.open();

const lightsGUI = sceneGUI.addFolder('Lights');
for (let i=0; i < lights.length; ++i) {
  const lightGUI = lightsGUI.addFolder(`Light ${i}`);
  lightGUI.add(lights[i].position, 'x', -500, 500, 10).onChange(updateParams);
  lightGUI.add(lights[i].position, 'y', -500, 500, 10).onChange(updateParams);
  lightGUI.add(lights[i].position, 'z', -500, 500, 10).onChange(updateParams);
}
//lightsGUI.open();

const cameraGUI = gui.addFolder('Camera');
cameraGUI.add(camera, 'fov').onChange(updateParams);
cameraGUI.add(camera.position, 'x').onChange(updateParams);
cameraGUI.add(camera.position, 'y').onChange(updateParams);
cameraGUI.add(camera.position, 'z').onChange(updateParams);
//cameraGUI.open();

const modelGUI = gui.addFolder('Model');
modelGUI.add(params, 'model', { Foo: 0, Bar: 1, Baz: 2 } );
modelGUI.add(model.rotation, 'x').step(0.01).listen();
modelGUI.add(model.rotation, 'y').step(0.01).listen();
modelGUI.add(model.rotation, 'z').step(0.01).listen();
//modelGUI.addColor(model.color, 'fg').onChange(redraw);
//modelGUI.addColor(model.color, 'bg').onChange(redraw);
modelGUI.open();

// Render Loop
function animate() {
  requestAnimationFrame(animate);

  stats.begin();
  model.rotateX(0.003);
  model.rotateY(0.005);
  model.rotateZ(0.007);

  // Render the scene
  renderer.render(scene, camera);
  stats.end();
}

animate();