import PathDrawingTool from "./PathDrawingTool";
import World from "../World";
import DrawingPoint from "./DrawingPoint";
import * as BABYLON from "babylonjs";


export default class {

    constructor(private _world: World) {
    }

    createSimpleTool() {
        return new PathDrawingTool(
            this._world,
            {
                transformPath: (path: DrawingPoint[]) => path,
                modifySurfacePoint: (point: BABYLON.Vector3, center: DrawingPoint, tool: PathDrawingTool) => point,
                tessalationInLength: 0.1,
                tessalationInRadius: 3,
                countPointRadius: (center: DrawingPoint) => center.intensity / 20 + .01,
                material: this._world.materialFactory.getMaterial('#aefffd')
            }
        );

    }


}