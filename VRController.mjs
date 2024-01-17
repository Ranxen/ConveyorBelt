import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

export class VRController {


    constructor(scene, renderer, id) {
        this.scene = scene;
        this.id = id;
        this.controller = null;
        this.controllerGrip = null;
        this.controllerModelFactory = new XRControllerModelFactory();
        this.draggedObject = null;
        this.rayDirection = new THREE.Vector3(0, 0, -1);
        this.buildController(scene, renderer, id);
    }

    buildController(scene, renderer, id) {
        let controller = renderer.xr.getController(id);
        controller.addEventListener('selectstart', () => {
            controller.userData.isSelecting = true;
        });
        controller.addEventListener('selectend', () => {
            controller.userData.isSelecting = false;
            this.releaseObject();
            this.releaseButton();
        });
        controller.addEventListener('squeezestart', () => {
            controller.userData.isSqueezeing = true;
        });
        controller.addEventListener('squeezeend', () => {
            controller.userData.isSqueezeing = false;
        });
        controller.addEventListener('connected', function (event) {
            console.log(`controller connects ${id} mode ${event.data.targetRayMode} ${event.data.handedness} hand`);
            renderer.xr.enabled = true;
        });
        controller.addEventListener('disconnected', () => {
            controller.remove(controller.children[0]);
            console.log(`controller disconnects ${id} `);
        });

        scene.add(controller);

        let controllerGrip = renderer.xr.getControllerGrip(id);
        controllerGrip.add(this.controllerModelFactory.createControllerModel(controllerGrip));
        scene.add(controllerGrip);

        let geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), this.rayDirection]);
        let line = new THREE.Line(geometry);
        controllerGrip.add(line);

        this.controller = controller;
        this.controllerGrip = controllerGrip;
    }

    selecting() {
        return this.controller.userData.isSelecting;
    }

    squeezeing() {
        return this.controller.userData.isSqueezeing;
    }

    intersectingObjects(objects) {
        let raycaster = new THREE.Raycaster();
        raycaster.set(this.controllerGrip.position, this.rayDirection.clone().applyQuaternion(this.controllerGrip.quaternion).normalize());
        let intersects = raycaster.intersectObjects(objects);

        return intersects;
    }

    dragObject(object) {
        let parent = object.userData.parent;

        if (this.draggedObject || !parent || parent.inBasket || parent.isGrabbed) {
            return;
        }

        if (parent.onGrabbed) {
            object.userData.parent.onGrabbed();
        }

        parent.isGrabbed = true;

        this.draggedObject = parent.object3D;
        this.draggedObject.position.copy(this.worldPosToControllerPos(this.draggedObject.position));
        this.scene.remove(this.draggedObject);
        this.controllerGrip.add(this.draggedObject);
    }

    releaseObject() {
        if (!this.draggedObject) {
            return;
        }

        this.draggedObject.userData.parent.isGrabbed = false;
        this.draggedObject.position.copy(this.controllerPosToWorldPos(this.draggedObject.position));
        this.draggedObject.rotation.copy(this.controllerGrip.rotation);
        this.controllerGrip.remove(this.draggedObject);
        this.scene.add(this.draggedObject);
        this.draggedObject = null;
    }

    worldPosToControllerPos(pos) {
        return this.controllerGrip.worldToLocal(pos.clone());
    }

    controllerPosToWorldPos(pos) {
        return this.controllerGrip.localToWorld(pos.clone());
    }


    pressButton(button) {
        if (this.pressedButton) {
            return;
        }

        this.pressedButton = button;
        this.pressedButton.clicked();
    }


    releaseButton() {
        if (!this.pressedButton) {
            return;
        }

        this.pressedButton.release();
        this.pressedButton = null;
    }

}