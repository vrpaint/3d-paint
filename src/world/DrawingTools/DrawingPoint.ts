import * as BABYLON from "babylonjs";

export default class DrawingPoint {//todo maybe use in update in AbstractDrawingTool
    constructor(public position: BABYLON.Vector3,
                public intensity: number) {
    }

    clone(): DrawingPoint {
        return new DrawingPoint(
            this.position.clone(),
            this.intensity
        )
    }
}