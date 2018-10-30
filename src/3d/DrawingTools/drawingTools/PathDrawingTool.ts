import { IDrawingTool } from '../IDrawingTool';
import ITranformPath from '../transformPath/ITransformPath';
import * as BABYLON from 'babylonjs';
import { World } from '../../World/World';
import { IFrame, cloneFrame } from '../../../model/IFrame';
import { cleanVectorToBabylon } from '../../../tools/vectors';
import { compose } from '../../../tools/compose';

//todo in options there can not be a functions, just pure types
interface IPathDrawingToolOptions {
    tessalationInLength: number;
    tessalationInRadius: number;
    structureId: string;
}

//todo do not hardcode this - to IPathDrawingToolOptions
const transformPath = compose<IFrame[]>();
const countFrameRadius = (center: IFrame) => center.intensity / 40 + 0.01;

export default class PathDrawingTool implements IDrawingTool<IPathDrawingToolOptions> {
    private drawing: boolean = false;
    private currentFrame: IFrame;

    private lastDrawingMeshes: BABYLON.Mesh[][] = [];
    private drawingFrames: IFrame[];
    private drawingMeshes: BABYLON.Mesh[]; //this should be only counted from lastDrawingMeshes
    private toolMesh: BABYLON.Mesh;

    constructor(
        private world: World,
        public options: IPathDrawingToolOptions,
    ) {
        this.init();
    }

    private async init() {
        //super(world);
        this.toolMesh = this.createToolMesh();
        this.toolMesh.scaling = BABYLON.Vector3.Zero();
        this.toolMesh.material = (await this.world.materialFactory.getStructure(
            this.options.structureId,
        )).babylonMaterial;
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
        return []; //todo
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
                countFrameRadius(frame),
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

        const transformedPath = transformPath(this.drawingFrames);

        //todo this.options.tessalationInRadius
        const ribbonMesh = BABYLON.MeshBuilder.CreateTube(
            'tube' + Math.random(),
            {
                path: transformedPath.map((drawingFrame) =>
                    cleanVectorToBabylon(drawingFrame.position),
                ),
                //radius: .05,
                radiusFunction: (i, distance) =>
                    countFrameRadius(transformedPath[i]),
            },
            this.world.scene,
        );

        ribbonMesh.material = this.toolMesh.material; //todo better

        const sphere1Mesh = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            { diameter: countFrameRadius(transformedPath[0]) * 2 },
            this.world.scene,
        );
        sphere1Mesh.position = cleanVectorToBabylon(
            transformedPath[0].position,
        );
        sphere1Mesh.material = this.toolMesh.material; //todo better

        const last = transformedPath.length - 1;
        const sphere2Mesh = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            {
                diameter: countFrameRadius(transformedPath[last]) * 2,
            },
            this.world.scene,
        );
        sphere2Mesh.position = cleanVectorToBabylon(
            transformedPath[last].position,
        );
        sphere2Mesh.material = this.toolMesh.material; //todo better

        return [ribbonMesh, sphere1Mesh, sphere2Mesh];
    }
}
