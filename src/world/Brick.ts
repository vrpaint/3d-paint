/*
import * as BABYLON from 'babylonjs';
import World from './World';


export default class Brick{
    public mesh:BABYLON.AbstractMesh;

    constructor(
        private _world:World,
        private _materialName:string,
        private _physicalProperties:{mass:number,restitution:number},
        private _size:BABYLON.Vector3,
        private _position:BABYLON.Vector3,
        private _rotation:BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        private _linearVelocity:BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        private _angularVelocity:BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        private _stretch = false

    ){
        this.createBabylonMesh();
        this._world.bricks.push(this);
        this.mesh.position = this._position;
        this.mesh.rotation = this._rotation;
        this.mesh.physicsImpostor.setLinearVelocity(this._linearVelocity);
        this.mesh.physicsImpostor.setAngularVelocity(this._angularVelocity);
    }


    get position():BABYLON.Vector3{
        return this._position;
    }

    get rotation():BABYLON.Vector3{
        return this.mesh.rotationQuaternion.toEulerAngles();
    }

    get linearVelocity():BABYLON.Vector3{
        return this.mesh.physicsImpostor.getLinearVelocity();
    }

    get angularVelocity():BABYLON.Vector3{
        return this.mesh.physicsImpostor.getAngularVelocity();
    }

    set linearVelocity(linearVelocity:BABYLON.Vector3){
        this.mesh.physicsImpostor.setLinearVelocity(linearVelocity);
    }

    set angularVelocity(angularVelocity:BABYLON.Vector3){
        this.mesh.physicsImpostor.setAngularVelocity(angularVelocity);
    }

    createBabylonMesh(){
        if(this._stretch){
            this.mesh = BABYLON.Mesh.CreateBox("box", 1, this._world.scene);
            this.mesh.scaling = new BABYLON.Vector3(
                this._size.x,
                this._size.y,
                this._size.z
            );
        }else{
            const globalScale = 10;
            const width = this._size.x;
            const height = this._size.y;
            const depth = this._size.z;
            const faceUV = [
                new BABYLON.Vector4(0, 0, width / globalScale, height / globalScale),
                new BABYLON.Vector4(0, 0, width / globalScale, height / globalScale),

                new BABYLON.Vector4(0, 0, height / globalScale, depth / globalScale),
                new BABYLON.Vector4(0, 0, height / globalScale, depth / globalScale),

                new BABYLON.Vector4(0, 0, depth / globalScale, width / globalScale),
                new BABYLON.Vector4(0, 0, depth / globalScale, width / globalScale),
            ];
            const meshOptions = {width, height, depth, faceUV};
            this.mesh = BABYLON.MeshBuilder.CreateBox('BoxBrick', meshOptions, this._world.scene);

        }

        this.mesh.material = this._world.materialFactory.getMaterial(this._materialName);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            this._physicalProperties,
            this._world.scene
        );

    }
}*/
