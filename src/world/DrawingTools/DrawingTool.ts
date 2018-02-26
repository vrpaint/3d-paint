import {isNull} from "util";
import * as BABYLON from "babylonjs";
import World from "../World";

class DrawingPoint {//todo maybe use in update in DrawingTool
    constructor(public position: BABYLON.Vector3,
                public intensity: number) {
    }
}


export default class DrawingTool {

    private _drawingPath: DrawingPoint[];
    private _drawingMesh: BABYLON.Mesh | null;
    private _toolMesh: BABYLON.Mesh;
    private _drawing: boolean = false
    private _position: BABYLON.Vector3;
    private _intensity: number;

    constructor(private _world: World) {
        this._toolMesh = BABYLON.Mesh.CreateSphere("sphere", 16, 1, this._world.scene);
        //const redrawMeshThrottled = _.throttle(redrawMesh,50);


    }

    intensityToRadius(intensity: number) {//todo as param in constructor (or config as param)
        return intensity / 20 + .01;
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
        this._toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(this.intensityToRadius(intensity));

        if (this._drawing) {

            if (
                this._drawingPath.length === 0 ||
                this._drawingPath[this._drawingPath.length - 1]
                    .position
                    .subtract(this._position)
                    .length() > 0.01
            ) {

                this._drawingPath.push(new DrawingPoint(
                    this._position.clone(),
                    intensity
                ));
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
                    path: this._drawingPath.map((drawingPoint) => drawingPoint.position),
                    radius: .05,
                    radiusFunction: (i, distance) => this.intensityToRadius(this._drawingPath[i].intensity)
                },
                this._world.scene
            );


            this._drawingMesh.material = this._world.materialFactory.getMaterial('#5effcd');




        }
    }

}