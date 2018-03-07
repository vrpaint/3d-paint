import AbstractDrawingTool from "./AbstractDrawingTool";
import DrawingPoint from "./DrawingPoint";
import * as BABYLON from "babylonjs";
import {isNull} from "util";
import World from "../World";

interface IPathDrawingToolOptions {
    tessalationInLength: number;
    tessalationInRadius: number;
    material: BABYLON.Material;

    transformPath(path: DrawingPoint[]): DrawingPoint[];

    modifySurfacePoint(point: BABYLON.Vector3, center: DrawingPoint, tool: PathDrawingTool): BABYLON.Vector3;

    countPointRadius(center: DrawingPoint): number;
}

export default class PathDrawingTool extends AbstractDrawingTool {

    public drawingPath: DrawingPoint[];

    constructor(world: World,
                public options: IPathDrawingToolOptions) {
        super(world);
    }

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


        const TESALATION = 10;


        const pathArray: BABYLON.Vector3[][] = this.drawingPath.map((drawingPoint) => {


            const radius = this.intensityToRadius(drawingPoint.intensity);


            const layer = [];


            for (let i = 0; i <= TESALATION; i++) {


                const rotation = i / TESALATION * Math.PI * 2;

                layer.push(new BABYLON.Vector3(
                    Math.cos(rotation) * radius,
                    0,
                    Math.sin(rotation) * radius,
                ).addInPlace(drawingPoint.position))


            }

            return layer;


        });


        const mesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray}, this.world.scene);


        /*const mesh = BABYLON.MeshBuilder.CreateTube(
            "tube" + Math.random(),
            {
                path: this.drawingPath.map((drawingPoint) => drawingPoint.position),
                radius: .05,
                radiusFunction: (i, distance) => this.intensityToRadius(this.drawingPath[i].intensity)
            },
            this.world.scene
        );*/

        mesh.material = this.world.materialFactory.getMaterial('#5effcd');

        return mesh;
    }


}