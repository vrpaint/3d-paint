import * as BABYLON from 'babylonjs';
import MaterialFactory from '../MaterialFactory';

export default function createGroundMesh(
    scene:BABYLON.Scene,
    materialFactory:MaterialFactory
):BABYLON.AbstractMesh{

    const groundMesh = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 2, scene);
    groundMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        groundMesh,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.1},
        scene
    );

    materialFactory.getStructure('DirtyIcySnow').then((structure) => {
        groundMesh.material = structure.babylonMaterial;

        (groundMesh.material as any).diffuseTexture.uScale = 200;
        (groundMesh.material as any).diffuseTexture.vScale = 200;

    });

    return groundMesh;
}