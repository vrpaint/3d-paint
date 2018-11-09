import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IEditorAppState,
    createNewEditorAppState,
} from './model/IEditorAppState';
import { ISaveState } from './controller/saver/ISaveState';
import { IObservableObject, observable } from 'mobx';
import { restoreAppState } from './controller/saver/restoreAppState';
import { saveAppStateAfterChange } from './controller/saver/saveAppStateAfterChange';
import { EditorAppRoot } from './view/EditorAppRoot/EditorAppRoot';
import { World } from './3d/World/World';

export class EditorApp {
    constructor(
        private rootElement: HTMLDivElement,
        private localStorageSaveKey: string,
    ) {}

    private appState: IEditorAppState & IObservableObject;
    private saveState: ISaveState & IObservableObject;
    private world: World;

    run() {
        this.appState = restoreAppState(
            this.localStorageSaveKey,
            createNewEditorAppState,
        );
        this.saveState = saveAppStateAfterChange(
            this.localStorageSaveKey,
            this.appState,
        );
        this.world = new World(this.appState); //todo is it pretty?

        ReactDOM.render(
            <EditorAppRoot
                {...{
                    appState: this.appState,
                    saveState: this.saveState,
                    world: this.world,
                }}
            />,
            this.rootElement,
        );
    }
}
