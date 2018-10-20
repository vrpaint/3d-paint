import * as BABYLON from 'babylonjs';

//todo
//move assets to assets/structures

export interface IStructure {
    id: string;
    babylonMaterial: BABYLON.StandardMaterial;
    /*physicsOptions: {
        mass: number,
        restitution: number,
        friction: number
    }*/
}
