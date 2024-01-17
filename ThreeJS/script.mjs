import * as THREE from './three.module.min.js';


let scene;
let camera;
let renderer;

let objects = [];


function setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let x = -5; x < 5; x += 2) {
        for (let y = -5; y < 5; y += 2) {
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0x00ff00 });
            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = x;
            cube.position.y = y;
            objects.push(cube);
            scene.add(cube);

            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
            sphere.position.x = x + 1;
            sphere.position.y = y + 1;
            objects.push(sphere);
            scene.add(sphere);

            let torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 16, 32), material);
            torus.position.x = x + 1;
            torus.position.y = y;
            objects.push(torus);
            scene.add(torus);
        }
    }

    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

    camera.position.z = 5;

    renderer.setAnimationLoop(animate);
}

function animate() {
    for (let object of objects) {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}


window.onload = () => {
    setup();
};