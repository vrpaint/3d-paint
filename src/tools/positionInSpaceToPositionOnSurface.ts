/*
todo delete

import { ICorners } from '../model/ICorners';
import { IVector2, IVector3 } from '../model/IVectors';
import { cleanVectorToBabylon } from './vectors';
import * as BABYLON from 'babylonjs';


export function cornersFromPlaneMesh(
    mesh: BABYLON.Mesh
){


    return {

        topLeft: {
            x: mesh.position.x - mesh.scaling.x/2,
            y: mesh.position.x - mesh.scaling.y/2,
            z: mesh.position.x - mesh.scaling.z/2,
        }
        topRight: IVector3;
        bottomLeft: IVector3;
    }

}


export function positionInSpaceToPositionOnSurface(
    positionInSpace: IVector3,
    corners: ICorners,
): IVector2 | null {


    plane.


    const corners = {



    }


    const middle = cleanVectorToBabylon(positionInSpace).subtractInPlace(
        cleanVectorToBabylon(corners.topLeft),
    );

    const left = cleanVectorToBabylon(corners.topRight).subtractInPlace(
        cleanVectorToBabylon(corners.topLeft),
    ); //todo optimize
    const down = cleanVectorToBabylon(corners.bottomLeft).subtractInPlace(
        cleanVectorToBabylon(corners.topLeft),
    ); //todo optimize

    const x =
        BABYLON.Vector3.Dot(middle, left) / BABYLON.Vector3.Dot(left, left); //todo optimize
    const y =
        BABYLON.Vector3.Dot(middle, down) / BABYLON.Vector3.Dot(down, down); //todo optimize

    return { x, y };
}
*/