import AbstractDrawingTool from "./AbstractDrawingTool";
import DrawingPoint from "./DrawingPoint";
import * as BABYLON from "babylonjs";
import {isNull} from "util";

export default class AbstractLineDrawingTool extends AbstractDrawingTool {

    public drawingPointA: DrawingPoint;
    public drawingPointB: DrawingPoint;

    restart() {
        super.restart();
        this.drawingPointA = this.currentPoint.clone();
        this.drawingPointB = this.currentPoint;
    }


    update(point: DrawingPoint) {

        super.update(point);

        if (this.drawing) {

            this.drawingPointB = this.currentPoint;
            this._redrawMesh();

        }
    }

    public createDrawingMesh(): BABYLON.Mesh {
        throw new Error(`This method should be overwritten.`);
    }

    private _redrawMesh() {
        if (!isNull(this.drawingMesh)) {
            this.drawingMesh.dispose();
            console.log('disposing');
        }
        this.drawingMesh = this.createDrawingMesh();
    }



}