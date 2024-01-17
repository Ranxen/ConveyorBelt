import * as THREE from 'three';
import { GameObject } from './GameObject.mjs';

export class Floor extends GameObject {

    constructor(pos) {
        super(pos);
        let groundTexture = new THREE.TextureLoader().load('models/floor.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(10000, 10000);

        let groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), groundMaterial);
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.addMesh(mesh);
    }

}