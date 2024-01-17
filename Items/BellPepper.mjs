import * as THREE from 'three';
import { ModelLoader } from '../ModelLoader.mjs';
import { Item } from './Item.mjs';

export class BellPepper extends Item {

    constructor(pos) {
        super(pos, "Bell Pepper");
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['bellPepper'].clone();
        model.scale.set(0.001, 0.001, 0.001);
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