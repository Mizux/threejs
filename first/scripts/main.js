// @ts-check
import * as THREE from './vendor/three.module.js';

// Create an empty scene
const scene = new THREE.Scene();
// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
    /*FOV=*/75,
    /*aspect=*/window.innerWidth / window.innerHeight,
    /*near=*/0.1,
    /*far=*/1000);
camera.position.set(0, 50, 100);
camera.lookAt(0.0, 0.0, 0.0);

const lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 500, 100);
lights[1].position.set(250, 250, 0);

scene.add(lights[0]);
scene.add(lights[1]);

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.toneMapping = THREE.ACESFilmicToneMapping;
//renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor('#101010');
// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// EventListener
window.addEventListener('resize', onWindowResize);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

const plane_geometry = new THREE.PlaneGeometry(1000, 500, 10, 10);
plane_geometry.rotateX(-Math.PI / 2);
//const plane_material = new THREE.MeshBasicMaterial({ color: "grey" });
const plane_material = new THREE.MeshPhongMaterial({ color: '#101010', flatShading: false });
const plane = new THREE.Mesh(plane_geometry, plane_material);
scene.add(plane);

const group = new THREE.Group();
group.position.set(0, 25, 0);
scene.add(group);

const box_geometry = new THREE.BoxGeometry(30, 30, 30);
const box_material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, flatShading: true });
const cube = new THREE.Mesh(box_geometry, box_material);
group.add(cube);

group.add(new THREE.LineSegments(box_geometry, lineMaterial));

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render Loop
function animate() {
  requestAnimationFrame(animate);

  group.rotateX(0.003);
  group.rotateY(0.005);
  group.rotateZ(0.007);

  // Render the scene
  renderer.render(scene, camera);
}

animate();