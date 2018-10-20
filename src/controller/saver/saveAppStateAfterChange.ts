import { IAppState } from '../../model/IAppState';
import { IObservableObject, observe, observable } from 'mobx';
import { debounce } from 'lodash';
import { LOCALSTORAGE_SAVE_KEY } from '../../config';
import { ISaveState } from './ISaveState';

export function saveAppStateAfterChange(
    appState: IAppState & IObservableObject,
): ISaveState & IObservableObject {
    const saveState: ISaveState & IObservableObject = observable({
        saved: null,
    });

    observe(
        appState,
        debounce(() => {
            localStorage.setItem(
                LOCALSTORAGE_SAVE_KEY,
                JSON.stringify(appState),
            );
            saveState.saved = new Date();
        }, 500),
    );

    return saveState;
}
