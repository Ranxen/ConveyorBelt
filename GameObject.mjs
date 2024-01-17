export class GameObject {


    constructor(pos) {
        this.pos = pos;
        this.meshes = [];
    }


    addMesh(mesh) {
        this.meshes.push(mesh);
    }

    getMeshes() {
        return this.meshes;
    }

}