import * as THREE from 'three';
import { GameObject } from './GameObject.mjs';
import { Game } from './Game.mjs';
import { Text } from './Text.mjs';

export class Button extends GameObject {

    constructor(pos, rot, color, text, callback) {
        super(pos);
        this.color = color;
        this.text = text;
        this.callback = callback;
        this.pressed = false;

        this.object3D = new THREE.Object3D();
        this.object3D.position.copy(pos);
        this.box = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, .01), new THREE.MeshBasicMaterial({ color: color }));
        this.box.userData.parent = this;
        this.object3D.userData.parent = this;
        this.object3D.add(this.box);
        this.object3D.add(...new Text(new THREE.Vector3(0, 0, 0), text, Game.instance.font, this).getMeshes());
        this.addMesh(this.object3D);
        this.object3D.rotation.x = rot.x * Math.PI / 180;
        this.object3D.rotation.y = rot.y * Math.PI / 180;
        this.object3D.rotation.z = rot.z * Math.PI / 180;
    }


    clicked() {
        if (this.pressed) {
            return;
        }

        this.pressed = true;
        this.box.material.color.set(this.color * .5);

        this.callback();
    }


    release() {
        if (!this.pressed) {
            return;
        }

        this.pressed = false;
        this.box.material.color.set(this.color);
    }

}