import { IAppState } from './IAppState';

export function createDefaultAppState(): IAppState {
    return {
        name: 'Drawing 1',
        drawings: [],
    };
}
