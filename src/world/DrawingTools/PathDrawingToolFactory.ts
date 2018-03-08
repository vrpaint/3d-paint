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
                transformPath: this.transformPathGrid,
                modifySurfacePoint: (point: BABYLON.Vector3, center: DrawingPoint, tool: PathDrawingTool) => point,
                tessalationInLength: 0.02,
                tessalationInRadius: 7,
                countPointRadius: (center: DrawingPoint) => center.intensity / 20 + .01,
                material: this._world.materialFactory.getMaterial('#aefffd')
            }
        );

    }


    transformPath(path: DrawingPoint[]): DrawingPoint[] {


        return path.map((drawingPoint) => {

            drawingPoint = drawingPoint.clone();


            //drawingPoint.rotation = new BABYLON.Quaternion(0,0,0);

            return drawingPoint;

        })


    }


    transformPathGrid(path: DrawingPoint[]): DrawingPoint[] {


        const newPath: DrawingPoint[] = [];

        for (let point of path) {

            point = point.clone();
            point.position.x = Math.round(point.position.x * 10) / 10;
            point.position.y = Math.round(point.position.y * 10) / 10;
            point.position.z = Math.round(point.position.z * 10) / 10;
            newPath.push(point);


        }

        return newPath;

        /*return path.reduce((path,drawingPoint,index) => {

            drawingPoint = drawingPoint.clone();


            if(Math.random()<.1){
                path.push(drawingPoint);

            }


            return path;

        },[]);*/


    }


}