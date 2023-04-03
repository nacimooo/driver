import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// setup renderer and add canvas to page
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// get canvas
const canvas = renderer.domElement;

// camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// orbit camera controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, -10, 0);
controls.update();

// setup floor plane
const planeSize = 40;

const Tloader = new THREE.TextureLoader();
const texture = Tloader.load('/images/checker.png');

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;

const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

// create the floor plane
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

// load 3d model
const loader = new GLTFLoader();
let gltf; // Define gltf as a global variable
loader.load('/car1/Taxi.gltf', function (loadedGltf) {
    gltf = loadedGltf; // Assign loaded gltf to the global variable

    scene.add(gltf.scene);
    renderer.render(scene, camera);

}, undefined, function (error) {
    console.log('failed to load')
});

// setup ambient light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const keyboard = {};
const speed = 0.2;
var isAccel = false;

function onKeyDown(event) {
    keyboard[event.code] = true;
}

function onKeyUp(event) {
    keyboard[event.code] = false;
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function animate() {
    requestAnimationFrame(animate);

    // Move the GLTF model with arrow keys
    if (keyboard["ArrowUp"]) {
        gltf.scene.position.z += speed;
        isAccel = true;
    } 

    if (keyboard["ArrowDown"]) {
        gltf.scene.position.z -= speed;
    } 

    if (keyboard["ArrowLeft"]) {
        gltf.scene.position.x -= speed;
        gltf.scene.rotation.y += 0.05;
    }
    if (keyboard["ArrowRight"]) {
        gltf.scene.position.x += speed;
        gltf.scene.rotation.y -= 0.05;
    }

    // Set camera position to be 5 units behind the model
    const cameraOffset = new THREE.Vector3(0, 2, 4);
    const modelPosition = gltf.scene.position.clone();
    const cameraPosition = modelPosition.add(cameraOffset);
    camera.position.copy(cameraPosition);

    // Set camera target to the model's position
    controls.target.copy(modelPosition);

    controls.update();
    renderer.render(scene, camera);
}




animate();
