import {isNull} from "util";
import * as BABYLON from "babylonjs";

export default class DrawingTool {

    private _drawingPath: BABYLON.Vector3[];
    private _drawingMesh: BABYLON.Mesh | null;
    private _toolMesh: BABYLON.Mesh;
    private _drawing: boolean = false
    private _position: BABYLON.Vector3;
    private _intensity: number;

    constructor(private _scene: BABYLON.Scene) {
        this._toolMesh = BABYLON.Mesh.CreateSphere("sphere", 16, 1, this._scene);
        //const redrawMeshThrottled = _.throttle(redrawMesh,50);


    }

    start() {
        if (this._drawing === false) {//todo is it best solution?
            this._drawing = true;
            this._drawingPath = [];
            this._drawingMesh = null;
        }
    }

    end() {
        this._drawing = false;

    }

    update(position: BABYLON.Vector3,
           intensity: number) {
        this._position = position;
        this._intensity = intensity;

        this._toolMesh.position = this._position;
        this._toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(intensity / 5 + .05);

        if (this._drawing) {

            if (this._drawingPath.length === 0 || this._drawingPath[this._drawingPath.length - 1].subtract(this._position).length() > 0.01) {

                this._drawingPath.push(this._position.clone());
                this._redrawMesh();
            }
        }

    }

    private _redrawMesh() {
        if (this._drawingPath.length > 1) {
            if (!isNull(this._drawingMesh)) {
                this._drawingMesh.dispose();
            }

            //console.log(`Redrawing ${this.path.length} long tube.`);

            this._drawingMesh = BABYLON.MeshBuilder.CreateTube(
                "tube",
                {
                    path: this._drawingPath,
                    radius: .05
                },
                this._scene
            );
        }
    }

}