import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GameObject } from "./GameObject.mjs";

export class Text extends GameObject {

    constructor(pos, text, font, parent) {
        super(pos);
        this.text = text;

        let geometry = new TextGeometry(text, {
            font: font,
            size: 0.1,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: false
        });

        let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = pos.x;
        mesh.position.y = pos.y;
        mesh.position.z = pos.z;
        if (parent !== undefined) {
            mesh.userData.parent = parent;
        }
        else {
            mesh.userData.parent = this;
        }
        this.addMesh(mesh);
    }

}