import * as BABYLON from "babylonjs";

export default class DrawingPoint {//todo maybe use in update in AbstractDrawingTool
    constructor(public position: BABYLON.Vector3,
                public rotation: BABYLON.Quaternion,
                public intensity: number) {
    }

    clone(): DrawingPoint {
        return new DrawingPoint(
            this.position.clone(),
            this.rotation.clone(),
            this.intensity
        )
    }
}