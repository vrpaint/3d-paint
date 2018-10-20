import PathDrawingTool from './drawingTools/PathDrawingTool';
import { World } from '../World/World';
import ITranformPath from './transformPath/ITransformPath';
import GridDrawingTool from './drawingTools/GridDrawingTool';
import { IFrame } from '../../model/IFrame';

function compose<T>(...funcs: ((input: T) => T)[]): (input: T) => T {
    return (input: T) => funcs.reduce((input, func) => func(input), input);
}

export default class {
    constructor(private _world: World) {}

    async createPathTool(materialName: string) {
        const transformPath: ITranformPath = compose();
        //createTransformPathGrid(1),
        //createTransformPathIntensity()

        return new PathDrawingTool(this._world, {
            transformPath,
            //modifySurfacePoint: (point: BABYLON.Vector3, center: IFrame, tool: PathDrawingTool) => point,
            tessalationInLength: 0.02,
            tessalationInRadius: 7,
            countFrameRadius: (center: IFrame) => center.intensity / 40 + 0.01,
            material: (await this._world.materialFactory.getStructure(
                materialName,
            )).babylonMaterial,
        });
    }

    async createGridTool(materialName: string, gridSize: number) {
        return new GridDrawingTool(this._world, {
            gridSize,
            material: (await this._world.materialFactory.getStructure(
                materialName,
            )).babylonMaterial,
        });
    }
}
