import * as BABYLON from 'babylonjs';
import World from '../World';
import createCamera from './createCamera';
import setPlayerMouseLock from './setPlayerMouseLock';
import setPlayerMovement from './setPlayerMovement';
import setPlayerAction from './setPlayerAction';
import {PLAYER} from '../../config';

export default class Player {

    public mesh: BABYLON.AbstractMesh;
    public camera: BABYLON.FreeCamera;

    constructor(public world: World) {

        this.camera = createCamera(world.scene);
        this.mesh = BABYLON.Mesh.CreateSphere("player", 16, 1, world.scene);
        this.mesh.isVisible = false;
        this.mesh.position = new BABYLON.Vector3(0, 2, 0);
        this.mesh.rotation = new BABYLON.Vector3(0, 0, 0);
        this.mesh.scaling = new BABYLON.Vector3(1, 4, 1);
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.SphereImpostor,
            {
                mass: 1,
                restitution: 0.01,
                friction: 100
            },
            world.scene
        );


        this.mesh.physicsImpostor.registerAfterPhysicsStep(() => {
            this.camera.position = this.mesh.position;
            this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        });


        setPlayerMouseLock(this.world.canvasElement, this.camera);
        setPlayerMovement(this);
        setPlayerAction(this);
    }

    get direction(): BABYLON.Vector3 {
        const point1 = this.mesh.position;
        const point2 = this.world.scene.pick(this.world.canvasElement.width / 2, this.world.canvasElement.height / 2, (mesh) => mesh === this.world.skyboxMesh).pickedPoint;

        return point2.subtract(point1);
    }

    get direction1(): BABYLON.Vector3 {
        const playerDirection = this.direction;
        return playerDirection.scale(1 / playerDirection.length());
    }

    get rotationY(): number {
        const playerDirection = this.direction;
        return Math.atan2(playerDirection.z, playerDirection.x);
    }

    addMovement(vector: BABYLON.Vector3) {

        const currentVelocity = this.mesh.physicsImpostor.getLinearVelocity();
        const onGround = true;

        const distance = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2));
        const rotation = Math.atan2(vector.z, vector.x) + this.rotationY;


        const rotatedVector = new BABYLON.Vector3(
            Math.cos(rotation) * distance,
            onGround ? vector.y : 0,
            Math.sin(rotation) * distance
        );

        const composedVelocity = currentVelocity.add(rotatedVector);
        const jumpVelocity = new BABYLON.Vector3(0, composedVelocity.y, 0);
        const surfaceVelocity = new BABYLON.Vector3(composedVelocity.x, 0, composedVelocity.z);

        const surfaceVelocityLength = surfaceVelocity.length();
        if (surfaceVelocityLength > PLAYER.SPEED.TERMINAL) {
            surfaceVelocity.scaleInPlace(PLAYER.SPEED.TERMINAL / surfaceVelocityLength);
        }

        const composedVelocityTerminated = surfaceVelocity.add(jumpVelocity);

        this.mesh.physicsImpostor.setLinearVelocity(composedVelocityTerminated);

    }
}