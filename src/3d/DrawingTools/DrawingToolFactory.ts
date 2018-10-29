import { DrawingToolAdapter } from './DrawingToolAdapter';
import { World } from '../World/World';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';

export class DrawingToolFactory {
    constructor(private world: World) {}

    //todo cache
    getDrawingTool(drawingToolConfig: IDrawingToolConfig): DrawingToolAdapter {
        return new DrawingToolAdapter(this.world, drawingToolConfig);
    }

    replayState() {
        for (const drawing of this.world.appState.drawings) {
            this.getDrawingTool(drawing.drawingToolConfig).replayState(drawing);
        }
    }
}
