import { IDrawing } from './IDrawing';

export interface IFile {
    name: string;
    drawings: IDrawing<{}>[];
}

export function createNewFile(): IFile {
    return {
        name: 'Drawing 1', //todo maybe increase numbers
        drawings: [],
    };
}
