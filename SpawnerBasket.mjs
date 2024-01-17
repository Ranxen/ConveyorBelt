import * as THREE from 'three';
import { Basket } from './Basket.mjs';
import { Text } from './Text.mjs';
import { Game } from './Game.mjs';

export class SpawnerBasket extends Basket {

    constructor(pos, item, draggableObjects, gameObjects, scene) {
        super(pos);
        this.item = item;
        this.currentItem = null;
        this.draggableObjects = draggableObjects;
        this.gameObjects = gameObjects;
        this.scene = scene;
        this.text = null;
        this.updateText();
    }


    updateText() {
        if (this.text) {
            this.object3D.remove(...this.text.getMeshes());
        }
        
        this.text = new Text(new THREE.Vector3(0, 1, 0), this.item.name, Game.instance.font);
        this.object3D.add(...this.text.getMeshes());
    }


    lookAt(pos) {
        this.text.getMeshes()[0].lookAt(pos);
    }


    spawnItem() {
        this.currentItem = new this.item(this.pos.clone().add(new THREE.Vector3(0, 0.1, 0)), 0xff0000);
        this.currentItem.onGrabbed = () => this.itemGrabbed(this.currentItem);
        this.draggableObjects.push(this.currentItem);
        this.gameObjects.push(this.currentItem);
        this.scene.add(...this.currentItem.getMeshes());
    }


    itemGrabbed(item) {
        item.onGrabbed = null;
        this.currentItem = null;
        this.spawnItem();
    }

}