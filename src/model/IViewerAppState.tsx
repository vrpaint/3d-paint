import { IFile, createNewFile } from './IFile';

export interface IViewerAppState {
    openedFile: IFile;
}

export function createNewViewerAppState(): IViewerAppState {
    return {
        openedFile: createNewFile(),
    };
}
