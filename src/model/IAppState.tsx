import { IDrawingTool } from './IDrawingTool';

export interface IAppState {
    name: string;
    drawings: IDrawingTool[];
}
