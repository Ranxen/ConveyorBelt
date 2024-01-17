import * as THREE from 'three';
import { ModelLoader } from '../ModelLoader.mjs';
import { Item } from './Item.mjs';

export class Pineapple extends Item {

    constructor(pos) {
        super(pos, "Pineapple");
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['pineapple'].clone();
        model.scale.set(0.002, 0.002, 0.002);
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