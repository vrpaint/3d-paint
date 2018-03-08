import * as BABYLON from "babylonjs";
import World from "../World";
import DrawingPoint from "./DrawingPoint";


export default class AbstractDrawingTool {

    public drawing: boolean = false
    public drawingMesh: BABYLON.Mesh | null;
    public currentPoint: DrawingPoint;

    //private _toolMesh: BABYLON.Mesh;

    constructor(public world: World) {
        //this._toolMesh = this.createToolMesh();
    }

    createToolMesh(): BABYLON.Mesh {
        return BABYLON.Mesh.CreateSphere("sphere", 16, 1, this.world.scene);
    }


    start() {
        if (this.drawing === false) {//todo is it best solution?
            this.restart();
        }
    }

    restart() {
        this.drawing = true;
        this.drawingMesh = null;
    }

    end() {
        this.drawing = false;
        console.log('Drawed ', this.drawingMesh);

    }

    update(point: DrawingPoint) {
        this.currentPoint = point;

        //this._toolMesh.position = point.position;
        //todo this._toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(this.intensityToRadius(point.intensity));
    }

}