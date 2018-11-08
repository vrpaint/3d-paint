import { IObservableObject, observable } from 'mobx';
import { debounce } from 'lodash';
import { ISaveState } from './ISaveState';
import { observeDeep } from '../../tools/observeDeep';

//todo maybe class saver
export function saveAppStateAfterChange(
    localStorageSaveKey: string,
    appState: IObservableObject
): ISaveState & IObservableObject {
    const saveState: ISaveState & IObservableObject = observable({
        saved: true,
    });

    const save = debounce(() => {
        localStorage.setItem(localStorageSaveKey, JSON.stringify(appState));
        saveState.saved = true;
    }, 1000);

    observeDeep(appState, () => {
        saveState.saved = false;
        save();
    });

    return saveState;
}
