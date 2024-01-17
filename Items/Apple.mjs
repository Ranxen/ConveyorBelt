import * as THREE from 'three';
import { ModelLoader } from '../ModelLoader.mjs';
import { Item } from './Item.mjs';

export class Apple extends Item {

    constructor(pos) {
        super(pos, "Apple");
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['apple'].clone();
        model.scale.set(.3, .3, .3);
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