import { IDrawing } from './IDrawing';

export interface IAppState {
    name: string;
    drawings: IDrawing<{}>[];
}
