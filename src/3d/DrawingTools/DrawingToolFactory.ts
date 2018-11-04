import { PathDrawingToolDefaultOptions } from './drawingTools/PathDrawingTool';
import { DrawingToolAdapter } from './DrawingToolAdapter';
import { World } from '../World/World';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';

//is this needed?
export class DrawingToolFactory {
    constructor(private world: World) {}

    //todo cache
    getDrawingTool(
        drawingToolConfig: IDrawingToolConfig<any>,
    ): DrawingToolAdapter {
        if (drawingToolConfig.toolId === 'path') {
            drawingToolConfig.options = Object.assign(
                {},
                PathDrawingToolDefaultOptions,
                drawingToolConfig.options,
            );
            drawingToolConfig.structureId = drawingToolConfig.structureId;

            //console.log('creating tool',JSON.parse(JSON.stringify(drawingToolConfig)));

            return new DrawingToolAdapter(this.world, drawingToolConfig);
        } else {
            throw new Error(`Not path`);
        }
    }

    async replayState() {
        for (const drawing of this.world.appState.drawings) {
            const drawingTool = this.getDrawingTool(drawing.drawingToolConfig);
            await drawingTool.replayState(drawing);
            drawingTool.dispose();
        }
    }
}
