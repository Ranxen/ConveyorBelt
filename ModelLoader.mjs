import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class ModelLoader {

    instance = null;
    models = {};
    materials = {};

    constructor() {
        if (ModelLoader.instance == null) {
            ModelLoader.instance = this;
        }
    }


    async loadModels() {
        await this.loadObjMaterial('models/orange.mtl');
        await this.loadObjModel('models/orange.obj');
        await this.loadFbxModel('models/pineapple.fbx');
        await this.loadObjMaterial('models/apple.mtl');
        await this.loadObjModel('models/apple.obj');
        await this.loadObjMaterial('models/banana.mtl');
        await this.loadObjModel('models/banana.obj');
        await this.loadObjMaterial('models/pear.mtl');
        await this.loadObjModel('models/pear.obj');
        await this.loadObjMaterial('models/bellPepper.mtl');
        await this.loadObjModel('models/bellPepper.obj');
        await this.loadFbxModel('models/basket.fbx');
        await this.loadObjMaterial('models/conveyor.mtl');
        await this.loadObjModel('models/conveyor.obj');
        await this.loadFbxModel('models/wall.fbx');
    }


    async loadObjModel(path) {
        return new Promise((resolve, reject) => {
            let loader = new OBJLoader();
            let modelName = path.split('/').pop().split('.')[0];
            loader.load(path, (obj) => {
                this.models[modelName] = obj;
                resolve();
            });
            loader.setMaterials(this.materials[modelName]);
        });
    }


    async loadObjMaterial(path) {
        return new Promise((resolve, reject) => {
            let loader = new MTLLoader();
            loader.load(path, (materials) => {
                let modelName = path.split('/').pop().split('.')[0];
                this.materials[modelName] = materials;
                resolve();
            });
        });
    }


    async loadFbxModel(path) {
        return new Promise((resolve, reject) => {
            let loader = new FBXLoader();
            let modelName = path.split('/').pop().split('.')[0];
            loader.load(path, (obj) => {
                this.models[modelName] = obj;
                resolve();
            });
        });
    }

}