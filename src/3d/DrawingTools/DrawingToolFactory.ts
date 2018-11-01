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


        if(drawingToolConfig.toolId==='path'){

            drawingToolConfig.options = Object.assign({},PathDrawingToolDefaultOptions,drawingToolConfig.options);
            return new DrawingToolAdapter(this.world, drawingToolConfig);

        }else{
            throw new Error(`Not path`);
        }

    }

    replayState() {
        for (const drawing of this.world.appState.drawings) {
            this.getDrawingTool(drawing.drawingToolConfig).replayState(drawing);
        }
    }
}
