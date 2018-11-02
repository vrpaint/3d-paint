import * as React from 'react';
import { IDrawingTool } from '../IDrawingTool';
import * as BABYLON from 'babylonjs';
import { World } from '../../World/World';
import { IFrame, cloneFrame } from '../../../model/IFrame';
import { cleanVectorToBabylon } from '../../../tools/vectors';

//todo split options into real and quality
//todo default values

interface IPathDrawingToolOptions {
    sizeMin: number;
    sizeMax: number;
    tessalationInLength: number;
    tessalationInRadius: number;
}

export const PathDrawingToolDefaultOptions = {
    sizeMin: 1 / 100,
    sizeMax: 1 / 40,
    tessalationInLength: 0.02,
    tessalationInRadius: 7,
};
export class PathDrawingTool implements IDrawingTool<IPathDrawingToolOptions> {
    private drawing: boolean = false;
    private currentFrame: IFrame;

    private lastDrawingMeshes: BABYLON.Mesh[][] = [];
    private drawingFrames: IFrame[];
    private drawingMeshes: BABYLON.Mesh[]; //this should be only counted from lastDrawingMeshes
    private toolMesh: BABYLON.Mesh;

    constructor(
        private world: World,
        private _structureId: string,
        public options: IPathDrawingToolOptions,
    ) {
        this.init();
        this.structureId = _structureId;
    }

    private async init() {
        this.toolMesh = this.createToolMesh();
        this.toolMesh.scaling = BABYLON.Vector3.Zero();
    }

    get structureId(): string {
        return this._structureId;
    }
    set structureId(structureId: string) {
        this._structureId = structureId;
        this.world.materialFactory.applyStructureOnMesh(
            structureId,
            this.toolMesh,
        );
    }

    get config() {
        return {
            toolId: 'path',
            structureId: this.structureId,
            options: this.options,
        };
    }

    /*
    todo
    get transformPath(...x){
        return compose<IFrame[]>(...x);
    }
    */
    private countFrameRadius(center: IFrame): number {
        return (
            center.intensity * (this.options.sizeMax - this.options.sizeMin) +
            this.options.sizeMin
        );
    }

    renderToolbar() {
        return (
            <div>
                <div className="field size">
                    {[1 / 100, 1 / 60, 1 / 40, 1 / 20, 1 / 10].map((size) => (
                        <div
                            key={size}
                            style={{
                                display: 'inline-block',
                                width: size * 400,
                                height: size * 400,
                                borderRadius: 400,
                                margin: 2,
                                backgroundColor: 'black',
                                border: `5px solid ${
                                    size === this.options.sizeMax
                                        ? 'red'
                                        : 'black'
                                }`,
                            }}
                            onClick={() => (this.options.sizeMax = size)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    private createToolMesh(): BABYLON.Mesh {
        return BABYLON.Mesh.CreateSphere('sphere', 16, 2, this.world.scene);
        //return BABYLON.Mesh.CreateBox("sphere", 2, this.world.scene);
    }

    start() {
        if (this.drawing === false) {
            //todo is it best solution?
            this.restart();
        }
    }

    end() {
        this.drawing = false;
        return this.drawingMeshes;
        //console.log('Drawed ', this.drawingMesh);
    }

    back() {
        if (this.lastDrawingMeshes.length) {
            const drawingMeshes = this.lastDrawingMeshes.pop() || [];
            if (drawingMeshes.length) {
                console.log('removing', drawingMeshes);
                for (const drawingMesh of drawingMeshes) {
                    drawingMesh.dispose();
                }
            } else {
                this.back(); //todo better
            }
        }
    }

    private restart() {
        //super.restart();
        this.drawing = true;
        this.drawingFrames = [];
        this.drawingMeshes = [];
        this.lastDrawingMeshes.push(this.drawingMeshes);
    }

    update(frame: IFrame) {
        //super.update(frame);
        this.currentFrame = frame;

        this.toolMesh.position = cleanVectorToBabylon(frame.position);
        this.toolMesh.rotation = cleanVectorToBabylon(frame.rotation);

        if (this.drawing) {
            this.toolMesh.scaling = BABYLON.Vector3.One().scaleInPlace(
                this.countFrameRadius(frame),
            );

            if (
                this.drawingFrames.length === 0 ||
                true
                /*todo
                this.drawingFrames[this.drawingFrames.length - 1].position
                    .subtract(frame.position)
                    .length() > this.options.tessalationInLength
                    */
            ) {
                this.drawingFrames.push(cloneFrame(frame));
                this.redrawMesh();
            }
        }
    }

    private redrawMesh() {
        if (this.drawingFrames.length > 1) {
            for (const drawingMesh of this.drawingMeshes) {
                drawingMesh.dispose();
                //console.log('disposing');
            }
            this.drawingMeshes = this.createDrawingMesh();
            this.lastDrawingMeshes[
                this.lastDrawingMeshes.length - 1
            ] = this.drawingMeshes; //todo remove
            //console.log(this.lastDrawingMeshes);
        }
    }

    private createDrawingMesh(): BABYLON.Mesh[] {
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

        const transformedPath = this.drawingFrames; //transformPath(this.drawingFrames);

        //todo this.options.tessalationInRadius
        const ribbonMesh = BABYLON.MeshBuilder.CreateTube(
            this.world.getNameForMesh(),
            {
                path: transformedPath.map((drawingFrame) =>
                    cleanVectorToBabylon(drawingFrame.position),
                ),
                //radius: .05,
                radiusFunction: (i, distance) =>
                    this.countFrameRadius(transformedPath[i]),
            },
            this.world.scene,
        );

        this.world.materialFactory.applyStructureOnMesh(
            this.structureId,
            ribbonMesh,
        );

        const sphere1Mesh = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            { diameter: this.countFrameRadius(transformedPath[0]) * 2 },
            this.world.scene,
        );
        sphere1Mesh.position = cleanVectorToBabylon(
            transformedPath[0].position,
        );
        this.world.materialFactory.applyStructureOnMesh(
            this.structureId,
            sphere1Mesh,
        );

        const last = transformedPath.length - 1;
        const sphere2Mesh = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            {
                diameter: this.countFrameRadius(transformedPath[last]) * 2,
            },
            this.world.scene,
        );
        sphere2Mesh.position = cleanVectorToBabylon(
            transformedPath[last].position,
        );
        this.world.materialFactory.applyStructureOnMesh(
            this.structureId,
            sphere2Mesh,
        );

        return [ribbonMesh, sphere1Mesh, sphere2Mesh];
    }
}
