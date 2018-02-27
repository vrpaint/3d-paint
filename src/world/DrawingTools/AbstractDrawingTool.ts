import * as BABYLON from "babylonjs";
import World from "../World";


export default class AbstractDrawingTool {

    public drawing: boolean = false
    public drawingMesh: BABYLON.Mesh | null;
    private _toolMesh: BABYLON.Mesh;
    private _position: BABYLON.Vector3;
    private _intensity: number;

    constructor(public world: World) {
        this._toolMesh = this.createToolMesh();
    }

    createToolMesh(): BABYLON.Mesh {
        return BABYLON.Mesh.CreateSphere("sphere", 16, 1, this.world.scene);
    }


    intensityToRadius(intensity: number) {//todo as param in constructor (or config as param)
        return intensity / 20 + .01;
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

    }

    update(position: BABYLON.Vector3,
           intensity: number) {
        this._position = position;
        this._intensity = intensity;

        this._toolMesh.position = this._position;
        this._toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(this.intensityToRadius(intensity));
    }

}