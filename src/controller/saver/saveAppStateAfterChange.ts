import { IAppState } from '../../model/IAppState';
import { IObservableObject, observe, observable } from 'mobx';
import { debounce } from 'lodash';
import { LOCALSTORAGE_SAVE_KEY } from '../../config';
import { ISaveState } from './ISaveState';
import { observeDeep } from '../../tools/observeDeep';

export function saveAppStateAfterChange(
    appState: IAppState & IObservableObject,
): ISaveState & IObservableObject {
    const saveState: ISaveState & IObservableObject = observable({
        saved: true,
    });

    const save = debounce(() => {
        localStorage.setItem(LOCALSTORAGE_SAVE_KEY, JSON.stringify(appState));
        saveState.saved = true;
    }, 1000);

    observeDeep(appState, () => {
        saveState.saved = false;
        save();
    });

    return saveState;
}
