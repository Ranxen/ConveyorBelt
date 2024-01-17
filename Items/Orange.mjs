import * as THREE from 'three';
import { ModelLoader } from '../ModelLoader.mjs';
import { Item } from './Item.mjs';

export class Orange extends Item {

    constructor(pos) {
        super(pos, "Orange");
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['orange'].clone();
        model.scale.set(0.01, 0.01, 0.01);
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