import Stats from './stats.module.js'
import * as THREE from './three.module.js'

let stats1, stats2, stats3;
let scene, camera, renderer;
let wire, group;

init();
animate();

function init() {
  stats1 = new Stats();
  stats1.showPanel(0); // Panel 0 = fps
  stats1.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
  stats1.domElement.style.display = 'inline';
  document.body.appendChild(stats1.domElement);

  stats2 = new Stats();
  stats2.showPanel(1); // Panel 1 = ms
  stats2.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
  stats2.domElement.style.display = 'none';
  document.body.appendChild(stats2.domElement);

  stats3 = new Stats();
  stats3.showPanel(2); // Panel 2 = mb
  stats3.domElement.style.cssText = 'position:absolute;top:0px;left:160px;';
  stats3.domElement.style.display = 'none';
  document.body.appendChild(stats3.domElement);

  // Create an empty scene
  scene = new THREE.Scene();

  // Create a basic perspective camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 24;
  camera.lookAt( 0.0, 0.0, 0.0);

  // Create a renderer with Antialiasing
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor("#101010");
  renderer.setSize( window.innerWidth, window.innerHeight );
  // Append Renderer to DOM
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize );

  // ------------------------------------------------
  // FUN STARTS HERE
  // ------------------------------------------------
  var geometry = new THREE.SphereGeometry(0.5, 16, 16);
  var material = new THREE.MeshBasicMaterial( { color:"#0040A0" } );
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(16, 0, 0);
  //scene.add( planet );

  var geometry = new THREE.SphereGeometry(0.125, 16, 16);
  var material = new THREE.MeshBasicMaterial( { color:"#A0A0A0" } );
  const moon = new THREE.Mesh(geometry, material);
  moon.position.set(19, 0, 0);
  //scene.add( moon );

  var geometry = new THREE.SphereGeometry(1.5, 8, 8);
  var material = new THREE.MeshBasicMaterial( { color:"#808080", wireframe:true, transparent:true } );
  wire = new THREE.Mesh( geometry, material );
  wire.position.set(16, 0, 0);
  wire.rotation.x = Math.PI / 2;
  //scene.add( wire );

  group = new THREE.Group();
  group.add( planet );
  group.add( moon );
  group.add( wire );
  scene.add( group );

  var geometry = new THREE.RingGeometry( 15.9, 16.1, 64 );
  var material = new THREE.MeshBasicMaterial( { color:"#F0F0F0", side:THREE.DoubleSide } );
  const orbit = new THREE.Mesh( geometry, material );
  scene.add( orbit );

  const radius = 16;
  const radials = 16;
  const circles = 8;
  const divisions = 64;
  const polarGrid = new THREE.PolarGridHelper( radius, radials, circles, divisions, "#F0F0F0", "#808080" );
  polarGrid.rotation.x = Math.PI / 2;
  scene.add( polarGrid );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// Render Loop
function animate() {
  requestAnimationFrame( animate );

  wire.rotation.y -= 0.04;
  group.rotateZ(0.005);

  // Render the scene
  renderer.render(scene, camera);
  stats1.update();
  stats2.update();
  stats3.update();
}
