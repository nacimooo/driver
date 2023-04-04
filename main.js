import './carphysics'
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
const planeSize = 500;

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


const accel = 0.1;
const topSpeed = 0.3
var speed = 0.1;


function onKeyDown(event) {
    keyboard[event.code] = true;
}

function onKeyUp(event) {
    keyboard[event.code] = false;
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function nextFrame() {
    requestAnimationFrame(nextFrame);

    checkButtons(gltf, keyboard, speed)

    // moveCamera(gltf, controls)
    const cameraOffset = new THREE.Vector3(0, 2, -5);
    moveCamera(gltf, controls, camera, cameraOffset)

    controls.update();
    renderer.render(scene, camera);
}


nextFrame();


function moveCamera(gltf, controls, camera, cameraOffset) {
    // Get the position and rotation of the GLTF object
    const modelPosition = gltf.scene.position.clone();
    const modelRotation = gltf.scene.rotation.clone();

    // Add 180 degrees to the object's rotation around the y-axis
    modelRotation.y += Math.PI;

    // Calculate the camera position based on the object's position and rotation
    const cameraPosition = new THREE.Vector3(
        modelPosition.x - Math.sin(modelRotation.y) * cameraOffset.z,
        modelPosition.y + cameraOffset.y,
        modelPosition.z - Math.cos(modelRotation.y) * cameraOffset.z
    );
    camera.position.copy(cameraPosition);

    // Set the camera target to the model's position
    controls.target.copy(modelPosition);
}
