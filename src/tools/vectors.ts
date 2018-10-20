import * as BABYLON from 'babylonjs';
import { IVector3, IVector } from '../model/IVectors';

export function babylonToCleanVector(vector3: BABYLON.Vector3): IVector3 {
    return {
        x: vector3.x,
        y: vector3.y,
        z: vector3.z,
    };
}

export function cleanVectorToBabylon(vector3: IVector3): BABYLON.Vector3 {
    return new BABYLON.Vector3(vector3.x, vector3.y, vector3.z);
}

export function vectorDistance(vector1: IVector, vector2: IVector) {
    return Math.sqrt(
        Math.pow((vector1.x || 0) - (vector2.x || 0), 2) +
            Math.pow((vector1.y || 0) - (vector2.y || 0), 2) +
            Math.pow((vector1['z'] || 0) - (vector2['z'] || 0), 2),
    );
}
