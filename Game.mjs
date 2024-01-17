import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { ModelLoader } from './ModelLoader.mjs';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { VRController } from "./VRController.mjs";
import { ConveyorBelt } from "./ConveyorBelt.mjs";
import { Banana } from './Items/Banana.mjs';
import { Apple } from './Items/Apple.mjs';
import { Pear } from './Items/Pear.mjs';
import { Orange } from './Items/Orange.mjs';
import { Pineapple } from './Items/Pineapple.mjs';
import { BellPepper } from './Items/BellPepper.mjs';
import { SpawnerBasket } from './SpawnerBasket.mjs';
import { OrderBasketSpawner } from './OrderBasketSpawner.mjs';
import { Text } from './Text.mjs';
import { Floor } from './Floor.mjs';
import { Wall } from './Wall.mjs';
import { Button } from './Button.mjs';

export class Game {

    items = [Banana, Apple, Pear, Orange, Pineapple, BellPepper];
    instance = null;
    font = null;
    floorY = 0;
    velocityMultiplier = 1;

    constructor() {
        if (Game.instance == null) {
            Game.instance = this;
        }

        this.clock = new THREE.Clock();
        this.gameObjects = [];
        this.draggableObjects = [];
        this.spawnerBaskets = [];
        this.orderBaskets = [];
        this.orderBasketSpawner = null;
        this.buttons = [];
        this.points = 0;
        this.pointsText = null;
        this.modelLoader = new ModelLoader();
        this.setup();
    }


    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async setup() {
        await this.modelLoader.loadModels();
        await this.loadFont();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x5599BB);
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));

        this.buildControllers();
        this.buildPointsText();
        this.buildGameObjects();
        this.buildButtons();

        this.camera.position.y = 5;
        this.camera.rotation.x = -Math.PI / 2;

        document.getElementById('loading').style.display = 'none';

        this.renderer.setAnimationLoop(() => this.animate());
    }

    async loadFont() {
        let loader = new FontLoader();
        await loader.loadAsync('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json').then(font => {
            this.font = font;
        });
    }

    buildControllers() {
        this.leftController = new VRController(this.scene, this.renderer, 0);
        this.rightController = new VRController(this.scene, this.renderer, 1);
    }

    buildPointsText() {
        this.pointsText = new Text(new THREE.Vector3(-.25, this.floorY + 1, -2), 'Points: 0', this.font);
        this.scene.add(...this.pointsText.getMeshes());
    }

    buildGameObjects() {
        this.buildWorld();
        this.buildSpawnerBaskets();

        this.orderBasketSpawner = new OrderBasketSpawner(new THREE.Vector3(4, this.floorY + .301, -1), this.items, this.gameObjects, this.scene, this.orderBaskets);
        this.gameObjects.push(this.orderBasketSpawner);
        this.orderBasketSpawner.spawnOrderBasket();

        this.scene.add(...this.gameObjectsToMeshes(this.gameObjects));

        this.scene.add(new THREE.HemisphereLight(0x808080, 0x606060, 10));
    }


    buildWorld() {
        this.gameObjects.push(new Floor(new THREE.Vector3(0, this.floorY, 0)));

        // front back walls
        this.gameObjects.push(new Wall(new THREE.Vector3(-2.25, this.floorY, -3), new THREE.Vector3(0, 0, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(4.25, this.floorY, 3), new THREE.Vector3(0, 180, 0)));

        // left right walls
        this.gameObjects.push(new Wall(new THREE.Vector3(-2, this.floorY, 6.3), new THREE.Vector3(0, 90, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(-2, this.floorY, -2), new THREE.Vector3(0, 90, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(2, this.floorY, -8.3), new THREE.Vector3(0, -90, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(2, this.floorY, 0), new THREE.Vector3(0, -90, 0)));

        // walls at conveyor
        this.gameObjects.push(new Wall(new THREE.Vector3(-8.74, this.floorY, -1.55), new THREE.Vector3(0, 0, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(2.44, this.floorY, -1.55), new THREE.Vector3(0, 0, 0)));

        // walls at conveyor end
        this.gameObjects.push(new Wall(new THREE.Vector3(-8.74, this.floorY, 5), new THREE.Vector3(0, 90, 0)));
        this.gameObjects.push(new Wall(new THREE.Vector3(8.74, this.floorY, -1.55), new THREE.Vector3(0, -90, 0)));

        this.gameObjects.push(new ConveyorBelt(new THREE.Vector3(4, this.floorY + 0.01, -1)));
        this.gameObjects.push(new ConveyorBelt(new THREE.Vector3(0, this.floorY + 0.01, -1)));
        this.gameObjects.push(new ConveyorBelt(new THREE.Vector3(-4, this.floorY + 0.01, -1)));
    }


    buildButtons() {
        let button = new Button(new THREE.Vector3(-.2, this.floorY + .3, -.4), new THREE.Vector3(-45, 0, 0), 0xAA0000, '+', () => this.increaseSpawnRate());
        this.buttons.push(button);
        this.scene.add(...button.getMeshes());

        button = new Button(new THREE.Vector3(.2, this.floorY + .3, -.4), new THREE.Vector3(-45, 0, 0), 0x00AA00, '-', () => this.decreaseSpawnRate());
        this.buttons.push(button);
        this.scene.add(...button.getMeshes());
    }


    increaseSpawnRate() {
        this.orderBasketSpawner.increaseSpawnRate();
        this.velocityMultiplier = 10000 / this.orderBasketSpawner.spawnDelay;
    }


    decreaseSpawnRate() {
        this.orderBasketSpawner.decreaseSpawnRate();
        this.velocityMultiplier = 10000 / this.orderBasketSpawner.spawnDelay;
    }


    createDebugSphere(pos, color) {
        let geometry = new THREE.SphereGeometry(0.1, 32, 32);
        let material = new THREE.MeshBasicMaterial({ color: color });
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(pos);
        this.scene.add(sphere);
    }


    buildSpawnerBaskets() {
        let distance = 0;
        let perRow = 3;
        let row = -1;
        for (let item of this.items) {
            let spawnerBasket = new SpawnerBasket(new THREE.Vector3(row, this.floorY + 0.01, distance), item, this.draggableObjects, this.gameObjects, this.scene);
            spawnerBasket.spawnItem();
            this.gameObjects.push(spawnerBasket);
            this.spawnerBaskets.push(spawnerBasket);
            distance += 0.6;
            perRow--;

            if (perRow == 0) {
                row = 1
                distance = 0;
            }
        }
    }

    animate() {
        let deltaTime = this.clock.getDelta();

        for (let orderBasket of this.orderBaskets) {
            orderBasket.update(deltaTime, this.velocityMultiplier);
            orderBasket.lookAt(this.camera.position);
        }

        for (let spawnerBasket of this.spawnerBaskets) {
            spawnerBasket.lookAt(this.camera.position);
        }

        this.orderBasketSpawner.update();

        let selectingControllers = [this.leftController, this.rightController].filter(controller => controller.selecting());

        for (let controller of selectingControllers) {
            let intersects = controller.intersectingObjects(this.gameObjectsToMeshes(this.draggableObjects));

            if (intersects.length > 0) {
                let selectedObject = intersects[0].object;

                controller.dragObject(selectedObject);
            }

            for (let orderBasket of this.orderBaskets) {
                if (controller.draggedObject?.userData.parent.isTouchingBasket(orderBasket)) {
                    let draggedObject = controller.draggedObject;
                    controller.releaseObject();
                    this.scene.remove(...draggedObject.userData.parent.getMeshes());
                    orderBasket.add(draggedObject);
                }
            }

            let buttonIntersects = controller.intersectingObjects(this.gameObjectsToMeshes(this.buttons));

            if (buttonIntersects.length > 0) {
                let button = buttonIntersects[0].object.userData.parent;
                controller.pressButton(button);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    gameObjectsToMeshes(gameObjects) {
        let meshes = [];

        gameObjects.forEach(gameObject => {
            meshes.push(...gameObject.getMeshes());
        });

        return meshes;
    }


    givePoints(orderBasket) {
        this.points += orderBasket.correctItems - orderBasket.wrongItems;
        this.scene.remove(...this.pointsText.getMeshes());
        this.pointsText = new Text(new THREE.Vector3(-.25, this.floorY + 1, -2), `Points: ${this.points}`, this.font);
        this.scene.add(...this.pointsText.getMeshes());
        this.scene.remove(...orderBasket.getMeshes());
        this.gameObjects.splice(this.gameObjects.indexOf(orderBasket), 1);
        this.orderBaskets.splice(this.orderBaskets.indexOf(orderBasket), 1);
    }

}