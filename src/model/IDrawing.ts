import { IDrawingToolConfig } from './IDrawingToolConfig';
import { IFrame } from './IFrame';

export interface IDrawing {
    id: string;
    drawingToolConfig: IDrawingToolConfig; //todo better naming
    frames: IFrame[];
}
