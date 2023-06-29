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
camera.position.set(0, 1, 3);
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
const plane_geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
plane_geometry.rotateX(-Math.PI / 2);
//const plane_material = new THREE.MeshBasicMaterial({ color: "grey" });
const plane_material = new THREE.MeshPhongMaterial({ color: '#101010', flatShading: false });
const plane = new THREE.Mesh(plane_geometry, plane_material);
scene.add(plane);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const unit_cube_geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
unit_cube_geometry.translate(0, 0.5, 0);
const unit_cube_material = new THREE.MeshBasicMaterial({ color: 'white' });
//const unit_cube_material = new THREE.MeshPhongMaterial({ color: '#101010', flatShading: false });
const unit_cube = new THREE.Mesh(unit_cube_geometry, unit_cube_material);
scene.add(unit_cube);

const model = new THREE.Group();
const box_geometry = new THREE.BoxGeometry(1, 1, 1);
const box_material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, flatShading: true });
const cube = new THREE.Mesh(box_geometry, box_material);
model.add(cube);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
model.add(new THREE.LineSegments(box_geometry, lineMaterial));
model.position.set(0, 0.5 * Math.SQRT2, 0);
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
    bg: '#000000',
    axesHelper: {
      visible: true,
    },
    plane: {
      visible: true,
      color: '#202020',
    },
    unit_cube: {
      visible: true,
      color: '#F0F0F0',
    },
  },
  model: {
    id: 0,
    rotation: {
      x: 0.003,
      y: 0.005,
      z: 0.007
    }
  }
};

function updateParams() {
  scene.background = new THREE.Color(params.scene.bg);
  plane.visible = params.scene.plane.visible;
  plane_material.color = new THREE.Color(params.scene.plane.color);
  unit_cube.visible = params.scene.unit_cube.visible;
  unit_cube_material.color = new THREE.Color(params.scene.unit_cube.color);
  
  camera.lookAt(0.0, 0.0, 0.0);
  camera.updateProjectionMatrix(); // if fov change
  //setModel(params.model);
}

// First define DAT.Gui instances
const gui = new DAT.GUI({ load: JSON });
// must be call before gui construction
//gui.remember(params);

//gui.add(param, 'percent', 0, 100, 1).onChange(redraw);

const sceneGUI = gui.addFolder('Scene');
sceneGUI.addColor(params.scene, 'bg').onChange(updateParams);
const sceneAxesHelperGUI = sceneGUI.addFolder('Axes Helper');
sceneAxesHelperGUI.add(params.scene.axesHelper, 'visible').onChange(updateParams);
const scenePlaneGUI = sceneGUI.addFolder('Plane');
scenePlaneGUI.add(params.scene.plane, 'visible').onChange(updateParams);
scenePlaneGUI.addColor(params.scene.plane, 'color').onChange(updateParams);
const sceneUnitCubeGUI = sceneGUI.addFolder('UnitCube');
sceneUnitCubeGUI.add(params.scene.unit_cube, 'visible').onChange(updateParams);
sceneUnitCubeGUI.addColor(params.scene.unit_cube, 'color').onChange(updateParams);
//sceneGUI.open();

const lightsGUI = sceneGUI.addFolder('Lights');
for (let i = 0; i < lights.length; ++i) {
  const lightGUI = lightsGUI.addFolder(`Light ${i}`);
  lightGUI.add(lights[i], 'visible');
  lightGUI.add(lights[i].position, 'x', -16, 16, 0.1).onChange(updateParams);
  lightGUI.add(lights[i].position, 'y', -16, 16, 0.1).onChange(updateParams);
  lightGUI.add(lights[i].position, 'z', -16, 16, 0.1).onChange(updateParams);
}
//lightsGUI.open();

const cameraGUI = gui.addFolder('Camera');
cameraGUI.add(camera, 'fov', 30, 150, 5).onChange(updateParams);
cameraGUI.add(camera.position, 'x', -16, 16, 0.1).onChange(updateParams);
cameraGUI.add(camera.position, 'y', -16, 16, 0.1).onChange(updateParams);
cameraGUI.add(camera.position, 'z', -16, 16, 0.1).onChange(updateParams);
//cameraGUI.open();

const modelGUI = gui.addFolder('Model');
modelGUI.add(params.model, 'id', { Foo: 0, Bar: 1, Baz: 2 });
const modelAnimationGUI = modelGUI.addFolder('Model Animation');
modelGUI.add(params.model.rotation, 'x', -0.01, 0.01, 0.001);
modelGUI.add(params.model.rotation, 'y', -0.01, 0.01, 0.001);
modelGUI.add(params.model.rotation, 'z', -0.01, 0.01, 0.001);
const modelStateGUI = modelGUI.addFolder('Model State');
modelStateGUI.add(model.rotation, 'x').step(0.01).listen();
modelStateGUI.add(model.rotation, 'y').step(0.01).listen();
modelStateGUI.add(model.rotation, 'z').step(0.01).listen();
//modelGUI.addColor(model.color, 'fg').onChange(redraw);
//modelGUI.addColor(model.color, 'bg').onChange(redraw);
modelGUI.open();

// Render Loop
function animate() {
  requestAnimationFrame(animate);

  stats.begin();
  model.rotateX(params.model.rotation.x);
  model.rotateY(params.model.rotation.y);
  model.rotateZ(params.model.rotation.z);

  // Render the scene
  renderer.render(scene, camera);
  stats.end();
}

animate();