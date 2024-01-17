import * as THREE from 'three';
import { ModelLoader } from './ModelLoader.mjs';
import { GameObject } from './GameObject.mjs';

export class Wall extends GameObject {

    constructor(pos, rot) {
        super(pos);
        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        let model = ModelLoader.instance.models['wall'].clone();
        model.scale.set(.02, .02, .02);
        model.rotation.x = rot.x * Math.PI / 180;
        model.rotation.y = rot.y * Math.PI / 180;
        model.rotation.z = rot.z * Math.PI / 180;
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