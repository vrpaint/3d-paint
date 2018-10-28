/*
todo delete
import { IDrawingTool } from './IDrawingTool';
import { IDrawing } from './../../model/IDrawing';
import PathDrawingTool from './drawingTools/PathDrawingTool';
import { World } from '../World/World';
import ITranformPath from './transformPath/ITransformPath';
import { IFrame } from '../../model/IFrame';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';
import { compose } from '../../tools/compose';

export default class {
    constructor(private world: World) {}

    //todo split get and create
    async getDrawingTool(
        drawingToolConfig: IDrawingToolConfig,
    ): Promise<IDrawingTool> {
        return this.spyOnTool(
            await this.createRawDrawingTool(drawingToolConfig),
            drawingToolConfig,
        );
    }

    //todo split get and create
    private async createRawDrawingTool(
        drawingToolConfig: IDrawingToolConfig,
    ): Promise<IDrawingTool> {
        const transformPath: ITranformPath = compose();
        //todo createGridTool
        //createTransformPathGrid(1),
        //createTransformPathIntensity()

        return new PathDrawingTool(this.world, drawingToolConfig.options);

        /*{
            transformPath,
            //modifySurfacePoint: (point: BABYLON.Vector3, center: IFrame, tool: PathDrawingTool) => point,
            tessalationInLength: 0.02,
            tessalationInRadius: 7,
            countFrameRadius: (center: IFrame) => center.intensity / 40 + 0.01,
            material: (await this.world.materialFactory.getStructure(
                drawingToolConfig.color,
            )).babylonMaterial,
        }* /
    }

    //todo maybe as decorator
    private spyOnTool(
        drawingTool: IDrawingTool,
        drawingToolConfig: IDrawingToolConfig /*todo better naming* /,
    ): IDrawingTool {
        let currentDrawing: null | IDrawing = null;
        /*
        todo
        this.world.appState.drawings.push(
            {
                id: 'abc',
                frames: [],
                drawingTool: drawingToolConfig
            }
        );
        * /

        const startInner = drawingTool.start;
        drawingTool.start = () => {
            console.log('start spy');
            currentDrawing = {
                id: 'abc',
                frames: [],
                drawingToolConfig,
            };
            startInner.call(drawingTool);
        };

        const endInner = drawingTool.end;
        drawingTool.end = () => {
            if (currentDrawing /*todo or drawingTool.drawing* /) {
                console.log('end spy');
                this.world.appState.drawings.push(currentDrawing);
                currentDrawing = null;
                endInner.call(drawingTool);
            }
        };

        const updateInner = drawingTool.update;
        drawingTool.update = (frame: IFrame) => {
            //todo maybe save in every frame or debounce
            if (currentDrawing /*todo or drawingTool.drawing* /) {
                console.log('update spy');
                currentDrawing.frames.push(frame);
            }
            updateInner.call(drawingTool, frame);
        };

        const backInner = drawingTool.back;
        drawingTool.back = () => {
            console.log('back spy');
            backInner.call(drawingTool);
        };

        return drawingTool;
    }

    async replayState() {
        for (const drawing of this.world.appState.drawings) {
            const drawingTool = await this.createRawDrawingTool(
                drawing.drawingToolConfig,
            );
            drawingTool.start();
            for (const frame of drawing.frames) {
                drawingTool.update(frame);
            }
            drawingTool.end();
        }
    }
}
*/