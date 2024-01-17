import * as THREE from 'three';
import { ModelLoader } from './ModelLoader.mjs';
import { GameObject } from './GameObject.mjs';

export class Basket extends GameObject {

    constructor(pos) {
        super(pos);
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['basket'].clone();
        model.scale.set(.02, .02, .02);
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.userData.parent = this;
            }
        });
        this.object3D.userData.parent = this;
        this.object3D.add(model);
        this.addMesh(this.object3D);
    }

}