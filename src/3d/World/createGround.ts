import { MaterialFactory } from './../MaterialFactory';
import * as BABYLON from 'babylonjs';

export function createGround(
    scene: BABYLON.Scene,
    materialFactory: MaterialFactory,
): BABYLON.AbstractMesh {
    const groundMesh = BABYLON.Mesh.CreateGround(
        'ground',
        1000,
        1000,
        2,
        scene,
    );

    materialFactory.getStructure('DirtyIcySnow').then((structure) => {
        groundMesh.material = structure.babylonMaterial;

        //todo better
        (groundMesh.material as any).diffuseTexture.uScale = 200;
        (groundMesh.material as any).diffuseTexture.vScale = 200;

        (groundMesh.material as any).bumpTexture.uScale = 200;
        (groundMesh.material as any).bumpTexture.vScale = 200;
    });

    return groundMesh;
}
