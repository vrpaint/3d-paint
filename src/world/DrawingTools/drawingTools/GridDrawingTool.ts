import AbstractDrawingTool from "../AbstractDrawingTool";
import DrawingPoint from "../DrawingPoint";
import * as BABYLON from "babylonjs";
import World from "../../World/index";

interface IGridDrawingToolOptions {
    gridSize: number;
    material: BABYLON.Material;
}

export default class GridDrawingTool extends AbstractDrawingTool {

    public lastGridPoint: DrawingPoint;

    constructor(world: World,
                public options: IGridDrawingToolOptions) {
        super(world);
    }

    restart() {
        super.restart();
        this.lastGridPoint = this._gridPoint(this.currentPoint);
        this._drawMesh(this.lastGridPoint);
    }

    update(point: DrawingPoint) {

        super.update(point);

        if (this.drawing) {


            const currentGridPoint = this._gridPoint(point);//todo or use point???


            if (
                !this.lastGridPoint.position.equals(currentGridPoint.position)
            ) {

                this.lastGridPoint = currentGridPoint;
                this._drawMesh(currentGridPoint);

                //this._redrawMesh();
            }
        }
    }


    private _gridPoint(point: DrawingPoint): DrawingPoint {
        const gridPoint = point.clone();
        gridPoint.position.x = Math.round(gridPoint.position.x / this.options.gridSize) * this.options.gridSize;
        gridPoint.position.y = Math.round(gridPoint.position.y / this.options.gridSize) * this.options.gridSize;
        gridPoint.position.z = Math.round(gridPoint.position.z / this.options.gridSize) * this.options.gridSize;
        return gridPoint;
    }


    private _drawMesh(point: DrawingPoint) {
        const box = BABYLON.Mesh.CreateBox('box', this.options.gridSize, this.world.scene);
        box.position = point.position;
        box.material = this.options.material;
    }

    /*private _redrawMesh() {
        if (this.drawingPath.length > 1) {
            if (!isNull(this.drawingMesh)) {
                this.drawingMesh.dispose();
                console.log('disposing');
            }
            //this.drawingMesh = this.createDrawingMesh();
        }
    }

    public createDrawingMesh()/!*: BABYLON.Mesh*!/ {

        for(const point of this.drawingPath){

            const box = BABYLON.Mesh.CreateBox('box', this.options.gridSize, this.world.scene);
            box.material = this.options.material;

        }


    }*/


}