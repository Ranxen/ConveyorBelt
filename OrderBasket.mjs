import * as THREE from 'three';
import { Game } from './Game.mjs';
import { Basket } from './Basket.mjs';
import { Text } from './Text.mjs';

export class OrderBasket extends Basket {

    velocity = 0.25;

    constructor(pos, availableItems) {
        super(pos);
        this.order = [];
        this.orderSize = 0;
        this.correctItems = 0;
        this.wrongItems = 0;
        this.availableItems = availableItems;
        this.textContainer = new THREE.Object3D();
        this.textContainer.position.copy(new THREE.Vector3(-0.5, 1, -.5));
        this.object3D.add(this.textContainer);
        this.text = null;
    }


    createOrder() {
        this.order = [];
        this.orderSize = 0;
        let shuffled = this.availableItems.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, Math.floor(Math.random() * shuffled.length / 2) + 1);
        for (let item of selected) {
            let itemCount = Math.floor(Math.random() * 3) + 1;
            this.order.push({ item: item, count: itemCount});
            this.orderSize += itemCount;
        }
        this.updateText();
    }


    updateText() {
        if (this.textContainer) {
            this.object3D.remove(this.textContainer);
        }

        this.textContainer = new THREE.Object3D();
        this.textContainer.position.copy(new THREE.Vector3(-.25, 1, -.25));
        this.object3D.add(this.textContainer);

        let text = '';
        for (let item of this.order) {
            text += `${item.item.name} x ${item.count}\n`;
        }
        this.text = new Text(new THREE.Vector3(0, 0, 0), text, Game.instance.font);
        this.textContainer.add(...this.text.getMeshes());
        this.showItemsPreview();
    }


    lookAt(pos) {
        this.textContainer.lookAt(pos);
    }


    update(deltaTime, velocityMultiplier) {
        this.move(deltaTime, velocityMultiplier);

        if (this.pos.x < -4) {
            Game.instance.givePoints(this);
        }
    }


    move(deltaTime, velocityMultiplier) {
        this.pos.x -= this.velocity * deltaTime * velocityMultiplier;
        this.object3D.position.x = this.pos.x;
    }


    add(itemMesh) {
        let item = itemMesh.userData.parent;
        let found = false;
        for (let orderItem of this.order) {
            if (orderItem.item == item.constructor) {
                orderItem.count--;
                found = true;

                if (orderItem.count == 0) {
                    this.order.splice(this.order.indexOf(orderItem), 1);
                }

                this.correctItems++;

                break;
            }
        }

        if (!found) {
            this.wrongItems++;
        }

        itemMesh.position.copy(this.object3D.worldToLocal(itemMesh.position.clone()));

        this.object3D.add(itemMesh);

        this.updateText();
        item.inBasket = true;
    }


    showItemsPreview() {
        let preview = new THREE.Object3D();
        preview.position.x = 0.5;
        preview.position.y = 0.5;
        preview.position.z = 0.5;

        let count = 0;
        for (let orderItem of this.order) {
            let item = new orderItem.item(new THREE.Vector3(-.75, -count * 0.175 - 0.45, -.5));
            item.getMeshes()[0].scale.multiplyScalar(0.5);
            preview.add(item.getMeshes()[0]);
            count++;
        }

        this.textContainer.add(preview);
    }


}