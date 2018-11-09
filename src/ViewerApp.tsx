import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ISaveState } from './controller/saver/ISaveState';
import { IObservableObject } from 'mobx';
import { restoreAppState } from './controller/saver/restoreAppState';
import { saveAppStateAfterChange } from './controller/saver/saveAppStateAfterChange';
import {
    createNewViewerAppState,
    IViewerAppState,
} from './model/IViewerAppState';
import { ViewerAppRoot } from './view/ViewerAppRoot/ViewerAppRoot';
import { ViewerWorld } from './3d/World/ViewerWorld';

export class ViewerApp {
    constructor(
        private rootElement: HTMLDivElement,
        private localStorageSaveKey: string,
    ) {}

    private appState: IViewerAppState & IObservableObject;
    private saveState: ISaveState & IObservableObject;
    private world: ViewerWorld;

    run() {
        this.appState = restoreAppState(
            this.localStorageSaveKey,
            createNewViewerAppState,
        );
        this.saveState = saveAppStateAfterChange(
            this.localStorageSaveKey,
            this.appState,
        );

        this.world = new ViewerWorld(this.appState); //todo is it pretty?

        ReactDOM.render(
            <ViewerAppRoot
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
