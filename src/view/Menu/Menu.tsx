import './Menu.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { World } from '../../3d/World/World';

interface IMenuProps {
    appState: IAppState & IObservableObject;
    world: World;
}

export const Menu = observer(({ appState, world }: IMenuProps) => {
    return (
        <div className="Menu" draggable>
            {/*
                <div className="stats">
                    {appState.drawings.length} drawings
                </div>
                */}

            <ul className="save">
                <li>
                    <input
                        defaultValue={appState.name}
                        onChange={(event) =>
                            (appState.name = event.target.value)
                        }
                    />
                </li>

                <li
                    onClick={() => {
                        if (confirm('Are you sure?')) {
                            appState.drawings = [];
                        }
                    }}
                >
                    New drawing
                </li>
            </ul>

            <ul className="export">
                <li onClick={() => {}}>Export to .json</li>
                <li onClick={() => world.export()}>Export to .glb</li>
                <li onClick={() => {}}>Export to .stl</li>
                <li onClick={() => {}}>Export to .png</li>
            </ul>
        </div>
    );
});
