import { IFile } from './IFile';

export interface IViewerAppState {
    openedId: string | null;
}

export function createNewViewerAppState(): IViewerAppState {
    return {
        openedId: null,
    };
}
