import AbstractDrawingTool from "../AbstractDrawingTool";
import ITranformPath from "../transformPath/ITranformPath";
import DrawingPoint from "../DrawingPoint";
import * as BABYLON from "babylonjs";
import {isNull} from "util";
import World from "../../World/index";

interface IPathDrawingToolOptions {
    tessalationInLength: number;
    tessalationInRadius: number;
    material: BABYLON.Material;
    transformPath: ITranformPath;

    //modifySurfacePoint(point: BABYLON.Vector3, center: DrawingPoint, tool: PathDrawingTool): BABYLON.Vector3;

    countPointRadius(center: DrawingPoint): number;
}

export default class PathDrawingTool extends AbstractDrawingTool {

    public lastDrawingMeshes: BABYLON.Mesh[][] = [];
    public drawingPath: DrawingPoint[];
    public drawingMeshes: BABYLON.Mesh[];//this should be only counted from lastDrawingMeshes
    private _toolMesh: BABYLON.Mesh;


    constructor(world: World,
                public options: IPathDrawingToolOptions) {
        super(world);
        this._toolMesh = this.createToolMesh();
        this._toolMesh.scaling = BABYLON.Vector3.Zero();
    }

    createToolMesh(): BABYLON.Mesh {
        return BABYLON.Mesh.CreateSphere("sphere", 16, 2, this.world.scene);
        //return BABYLON.Mesh.CreateBox("sphere", 2, this.world.scene);
    }

    setMaterial(material: BABYLON.Material) {
        this.options.material = material;
        this._toolMesh.material = material;
    }

    

    back(){
        if(this.lastDrawingMeshes.length){
            const drawingMeshes = this.lastDrawingMeshes.pop();
            if(drawingMeshes.length){
                console.log('removing',drawingMeshes);
                for(const drawingMesh of drawingMeshes) {
                    drawingMesh.dispose();
                }
            }else{
                this.back();//todo better
            }
        }
    }

    restart() {
        super.restart();
        this.drawingPath = [];
        this.drawingMeshes = [];
        this.lastDrawingMeshes.push(this.drawingMeshes);
    }

    update(point: DrawingPoint) {

        super.update(point);

        this._toolMesh.position = point.position;
        this._toolMesh.rotation = point.rotation;


        if (this.drawing) {

            this._toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(this.options.countPointRadius(point));


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
            for(const drawingMesh of this.drawingMeshes) {
                drawingMesh.dispose();
                //console.log('disposing');
            }
            this.drawingMeshes = this.createDrawingMesh();
            this.lastDrawingMeshes[this.lastDrawingMeshes.length-1] = this.drawingMeshes;//todo remove
            //console.log(this.lastDrawingMeshes);
        }
    }

    public createDrawingMesh(): BABYLON.Mesh[] {


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
        const ribbonMesh = BABYLON.MeshBuilder.CreateTube(
            "tube" + Math.random(),
            {
                path: transformedPath.map((drawingPoint) => drawingPoint.position),
                //radius: .05,
                radiusFunction: (i, distance) => this.options.countPointRadius(transformedPath[i])
            },
            this.world.scene
        );

        ribbonMesh.material = this.options.material;



        const sphere1Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:this.options.countPointRadius(transformedPath[0])*2}, this.world.scene);
        sphere1Mesh.position = transformedPath[0].position;
        sphere1Mesh.material = this.options.material;


        const last = transformedPath.length-1;
        const sphere2Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:this.options.countPointRadius(transformedPath[last])*2}, this.world.scene);
        sphere2Mesh.position = transformedPath[last].position;
        sphere2Mesh.material = this.options.material;



        return [ribbonMesh,sphere1Mesh,sphere2Mesh];
    }


}