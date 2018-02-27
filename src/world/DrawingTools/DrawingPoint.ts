import * as BABYLON from "babylonjs";

export default class DrawingPoint {//todo maybe use in update in AbstractDrawingTool
    constructor(public position: BABYLON.Vector3,
                public intensity: number) {
    }
}