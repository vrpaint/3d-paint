import { IDrawingToolConfig } from './IDrawingToolConfig';
import { IFrame } from './IFrame';

export interface IDrawing<TOptions> {
    id: string;
    drawingToolConfig: IDrawingToolConfig<TOptions>; 
    frames: IFrame[];
}
