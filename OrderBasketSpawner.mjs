import { GameObject } from './GameObject.mjs';
import { OrderBasket } from './OrderBasket.mjs';

export class OrderBasketSpawner extends GameObject {

    nextSpawn = 0;
    spawnDelay = 10000;

    constructor(pos, items, gameObjects, scene, orderBaskets, font) {
        super(pos);
        this.items = items;
        this.gameObjects = gameObjects;
        this.scene = scene;
        this.orderBaskets = orderBaskets;
        this.font = font;
        this.nextSpawn = Date.now() + this.spawnDelay;
    }


    update() {
        if (Date.now() > this.nextSpawn) {
            this.spawnOrderBasket();
        }
    }


    spawnOrderBasket() {
        let orderBasket = new OrderBasket(this.pos.clone(), this.items, this.font);
        orderBasket.createOrder();
        this.gameObjects.push(orderBasket);
        this.orderBaskets.push(orderBasket);
        this.scene.add(...orderBasket.getMeshes());
        this.nextSpawn = Date.now() + this.spawnDelay;
    }


    increaseSpawnRate() {
        if (this.spawnDelay <= 500) {
            return;
        }

        this.spawnDelay -= 500;
    }


    decreaseSpawnRate() {
        if (this.spawnDelay >= 15000) {
            return;
        }

        this.spawnDelay += 500;
    }


}