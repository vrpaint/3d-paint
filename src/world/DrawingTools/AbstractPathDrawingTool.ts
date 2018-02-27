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

    update(position: BABYLON.Vector3,
           intensity: number) {

        super.update(position, intensity);

        if (this.drawing) {

            if (
                this.drawingPath.length === 0 ||
                this.drawingPath[this.drawingPath.length - 1]
                    .position
                    .subtract(position)
                    .length() > 0.01
            ) {

                this.drawingPath.push(new DrawingPoint(
                    position.clone(),
                    intensity
                ));
                this._redrawMesh();
            }
        }
    }

    public createDrawingMesh(): BABYLON.Mesh {
        throw new Error(`This method should be overwritten.`);
    }

    private _redrawMesh() {
        if (this.drawingPath.length > 1) {
            if (!isNull(this.drawingMesh)) {
                this.drawingMesh.dispose();
            }
            this.drawingMesh = this.createDrawingMesh();
        }
    }

}