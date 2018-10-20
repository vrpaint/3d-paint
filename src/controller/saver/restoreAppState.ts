import { LOCALSTORAGE_SAVE_KEY } from '../../config';
import { IAppState } from '../../model/IAppState';
import { observable, IObservableObject } from 'mobx';
import { createDefaultAppState } from '../../model/createDefaultAppState';

export function restoreAppState(): IAppState & IObservableObject {
    let appState: IAppState;
    try {
        const appModelSerialized = localStorage.getItem(LOCALSTORAGE_SAVE_KEY);
        if (!appModelSerialized) {
            throw new Error(
                `In localStorage is not value ${LOCALSTORAGE_SAVE_KEY}.`,
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
        appState = createDefaultAppState();
    }
    return observable(appState);
}
