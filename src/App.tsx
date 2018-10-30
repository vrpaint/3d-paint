import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IAppState } from './model/IAppState';
import { ISaveState } from './controller/saver/ISaveState';
import { IObservableObject, observable } from 'mobx';
import { restoreAppState } from './controller/saver/restoreAppState';
import { saveAppStateAfterChange } from './controller/saver/saveAppStateAfterChange';
import { Root } from './view/Root/Root';
import * as TC from 'touchcontroller';
import { World } from './3d/World/World';

export class App {
    constructor(private rootElement: HTMLDivElement) {}

    private appState: IAppState & IObservableObject;
    private saveState: ISaveState & IObservableObject;
    private world: World;

    run() {
        this.appState = restoreAppState();
        this.saveState = saveAppStateAfterChange(this.appState);
        this.world = new World(
            this.appState
                );//todo is it pretty?

        ReactDOM.render(
            <Root
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
