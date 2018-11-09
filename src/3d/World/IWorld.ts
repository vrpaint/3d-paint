import * as BABYLON from 'babylonjs';
import { MaterialFactory } from '../MaterialFactory';
import { IFile } from '../../model/IFile';

export interface IWorld {
    scene: BABYLON.Scene;
    materialFactory: MaterialFactory;

    openedFile: IFile;
    drawingsMeshes: { id: string; meshes: BABYLON.Mesh[] }[];

    getNameForMesh: (label?: string) => string;

    dispose: () => void;
}
