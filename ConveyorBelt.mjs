import * as THREE from 'three';
import { ModelLoader } from './ModelLoader.mjs';
import { GameObject } from './GameObject.mjs';

export class ConveyorBelt extends GameObject {


    constructor(pos) {
        super(pos);
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['conveyor'].clone();
        model.scale.set(2, 2, 2);
        model.rotation.y = Math.PI / 2;
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