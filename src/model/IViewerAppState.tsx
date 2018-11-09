import { IFile } from './IFile';

export interface IViewerAppState {
    openedFile: null | IFile;
}

export function createNewViewerAppState(): IViewerAppState {
    return {
        openedFile: null,
    };
}
