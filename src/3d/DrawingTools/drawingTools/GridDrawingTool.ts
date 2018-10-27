/*

todo


import { IDrawingTool } from '../IDrawingTool';
import * as BABYLON from 'babylonjs';
import { World } from '../../World/World';
import { IFrame, cloneFrame } from '../../../model/IFrame';
import { cleanVectorToBabylon } from '../../../tools/vectors';

interface IGridDrawingToolOptions {
    gridSize: number;
    material: BABYLON.Material; //todo here should be structure
}

export default class GridDrawingTool implements IDrawingTool {
    public lastGridFrame: IFrame;

    constructor(world: World, public options: IGridDrawingToolOptions) {
        super(world);
    }

    restart() {
        super.restart();
        this.lastGridFrame = this._gridFrame(this.currentFrame);
        this._drawMesh(this.lastGridFrame);
    }

    update(frame: IFrame) {
        super.update(frame);

        if (this.drawing) {
            const currentGridFrame = this._gridFrame(frame); //todo or use point???

            if (
                true // todo !this.lastGridFrame.position.equals(currentGridFrame.position)
            ) {
                this.lastGridFrame = currentGridFrame;
                this._drawMesh(currentGridFrame);

                //this._redrawMesh();
            }
        }
    }

    private _gridFrame(frame: IFrame): IFrame {
        const gridFrame = cloneFrame(frame);
        gridFrame.position.x =
            Math.round(gridFrame.position.x / this.options.gridSize) *
            this.options.gridSize;
        gridFrame.position.y =
            Math.round(gridFrame.position.y / this.options.gridSize) *
            this.options.gridSize;
        gridFrame.position.z =
            Math.round(gridFrame.position.z / this.options.gridSize) *
            this.options.gridSize;
        return gridFrame;
    }

    private _drawMesh(frame: IFrame) {
        const box = BABYLON.Mesh.CreateBox(
            'box',
            this.options.gridSize,
            this.world.scene,
        );
        box.position = cleanVectorToBabylon(frame.position);
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


    }* /
}
*/
