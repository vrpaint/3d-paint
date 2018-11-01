import './Root.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Message } from '../Message/Message';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { Scene } from '../Scene/Scene';
import { World } from '../../3d/World/World';
import { Toolbars } from '../Toolbars/Toolbars';

interface IAppProps {
    appState: IAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    world: World;
}

export const Root = observer(({ appState, saveState, world }: IAppProps) => {
    return (
        <div className="Root">
            <div className="Heading">
                <Message {...{ appState }} />
                {saveState.saved && (
                    <div>Saved at {saveState.saved.toString()}</div>
                )}

                <div>
                    Wall contains {appState.drawings.length} drawings.
                    <button
                        onClick={() => {
                            if (confirm('Are you sure?')) {
                                appState.drawings = [];
                            }
                        }}
                    >
                        clean
                    </button>
                </div>

                <div>
                    <button onClick={() => world.export()}>
                        Export to .glb
                    </button>
                </div>
            </div>

            <Toolbars {...{ world }} />
            <Scene {...{ world }} />
        </div>
    );
});
