import AbstractDrawingTool from "./AbstractDrawingTool";
import ITranformPath from "./transformPath/ITranformPath";
import DrawingPoint from "./DrawingPoint";
import * as BABYLON from "babylonjs";
import {isNull} from "util";
import World from "../World";

interface IPathDrawingToolOptions {
    tessalationInLength: number;
    tessalationInRadius: number;
    material: BABYLON.Material;
    transformPath: ITranformPath;

    //modifySurfacePoint(point: BABYLON.Vector3, center: DrawingPoint, tool: PathDrawingTool): BABYLON.Vector3;

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
                    .length() > this.options.tessalationInLength
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


        /*const pathArray: BABYLON.Vector3[][] = this.options.transformPath(this.drawingPath).map((drawingPoint) => {


            const radius = this.options.countPointRadius(drawingPoint);


            const layer = [];


            for (let i = 0; i <= this.options.tessalationInRadius + 1; i++) {


                const rotation = i / this.options.tessalationInRadius * Math.PI * 2;







                const surfaceFlatPoint = new BABYLON.Vector2(
                    Math.cos(rotation) * radius,
                    Math.sin(rotation) * radius
                );




                const surfaceVector = new BABYLON.Vector2(
                    Math.cos(rotation),
                    Math.sin(rotation)
                );



                //surfaceFlatPoint.











                layer.push(this.options.modifySurfacePoint(new BABYLON.Vector3(
                    Math.cos(rotation) * radius,
                    0,
                    Math.sin(rotation) * radius,
                ).addInPlace(drawingPoint.position), drawingPoint, this));


            }

            return layer;


        });


        const mesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray}, this.world.scene);*/


        const transformedPath = this.options.transformPath(this.drawingPath);


        //todo this.options.tessalationInRadius
        const mesh = BABYLON.MeshBuilder.CreateTube(
            "tube" + Math.random(),
            {
                path: transformedPath.map((drawingPoint) => drawingPoint.position),
                //radius: .05,
                radiusFunction: (i, distance) => this.options.countPointRadius(transformedPath[i])
            },
            this.world.scene
        );

        mesh.material = this.options.material;

        return mesh;
    }


}