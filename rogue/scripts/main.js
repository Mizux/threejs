import Display from './Display.js';
import * as THREE from './three.module.js';
import * as TWEEN from './Tween.js';
//import * as GSAP from './gsap.js';
import * as ROT from './rot.js';

const display = new Display();
display.initialize();
display.animate();

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------
const group = new THREE.Group();
group.position.set(0, 25, 0);
display.scene.add(group);

const box_geometry = new THREE.BoxGeometry(25, 25, 25);
const box_material = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, flatShading: true });
const box = new THREE.Mesh(box_geometry, box_material);
group.add(box);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
group.add(new THREE.LineSegments(box_geometry, lineMaterial));

// Render Loop
const animate = (t) => {
  window.requestAnimationFrame(animate)
  group.rotateX(0.003);
  group.rotateY(0.005);
  group.rotateZ(0.007);
}
animate();
