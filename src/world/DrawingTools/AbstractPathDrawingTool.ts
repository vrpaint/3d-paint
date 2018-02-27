import AbstractDrawingTool from "./AbstractDrawingTool";
import DrawingPoint from "./DrawingPoint";
import * as BABYLON from "babylonjs";
import {isNull} from "util";

export default class AbstractPathDrawingTool extends AbstractDrawingTool {

    public drawingPath: DrawingPoint[];

    restart() {
        super.restart();
        this.drawingPath = [];
    }

    update(point: DrawingPoint) {

        super.update(point);

        if (this.drawing) {

            if (
                this.drawingPath.length === 0 ||
                this.drawingPath[this.drawingPath.length - 1]
                    .position
                    .subtract(point.position)
                    .length() > 0.01
            ) {

                this.drawingPath.push(point.clone());
                this._redrawMesh();
            }
        }
    }

    private _redrawMesh() {
        if (this.drawingPath.length > 1) {
            if (!isNull(this.drawingMesh)) {
                this.drawingMesh.dispose();
                console.log('disposing');
            }
            this.drawingMesh = this.createDrawingMesh();
        }
    }

    public createDrawingMesh(): BABYLON.Mesh {
        throw new Error(`This method should be overwritten.`);
    }


}