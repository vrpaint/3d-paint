import { IFile, createNewFile } from './IFile';

export interface IViewerAppState {
    loading: number;
    openedFile: IFile;
}

export function createNewViewerAppState(): IViewerAppState {
    return {
        loading: 0,
        openedFile: createNewFile(),
    };
}
