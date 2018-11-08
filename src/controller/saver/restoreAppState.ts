import { observable, IObservableObject } from 'mobx';

//todo maybe class saver
export function restoreAppState<TState>(localStorageSaveKey: string,createNewAppState: ()=>TState): TState & IObservableObject {
    let appState: TState;
    try {
        const appModelSerialized = localStorage.getItem(localStorageSaveKey);
        if (!appModelSerialized) {
            throw new Error(
                `In localStorage is not value ${localStorageSaveKey}.`,
            );
        }
        appState = JSON.parse(appModelSerialized);

        //todo here check appState and its version and use migrations.
    } catch (error) {
        console.warn(
            `Error while trying to deserialize saved state - creating new state.`,
        );
        console.warn(error);
        //todo backup
        //todo migrations
        appState = createNewAppState();
    }
    return observable(appState);
}
