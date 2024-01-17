import * as THREE from 'three';
import { GameObject } from '../GameObject.mjs';

export class Item extends GameObject {

    constructor(pos, itemName) {
        super(pos);
        this.itemName = itemName;
        this.inBasket = false;
        this.grabbed = false;
    }


    isTouchingBasket(basket) {
        let meshes = this.getMeshes();
        let otherMeshes = basket.getMeshes();
        for (const mesh of meshes) {
            for (const otherMesh of otherMeshes) {
                let worldPos = new THREE.Vector3();
                mesh.getWorldPosition(worldPos);
                let otherWorldPos = new THREE.Vector3();
                otherMesh.getWorldPosition(otherWorldPos);
                let distance = worldPos.distanceTo(otherWorldPos);
                if (distance < .3) {
                    return true;
                }
            }
        }

        return false;
    }

}