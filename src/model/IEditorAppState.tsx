import { IDrawing } from './IDrawing';
import { IFile, createNewFile } from './IFile';

export interface IEditorAppState {
    openedFile: IFile;
}

export function createNewEditorAppState(): IEditorAppState {
    return {
        openedFile: createNewFile(),
    };
}
