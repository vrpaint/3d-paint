import './Menu.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { World } from '../../3d/World/World';
import * as downloadjs from 'downloadjs';
import { normalize } from '../../tools/normalize';
import { createNewFile } from '../../model/IFile';

interface IMenuProps {
    appState: IEditorAppState & IObservableObject;
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
                        defaultValue={appState.openedFile.name}
                        onChange={(event) =>
                            (appState.openedFile.name = event.target.value)
                        }
                    />
                </li>

                <li
                    onClick={() => {
                        if (confirm('Are you sure?')) {
                            world.clean();//todo better
                            appState.openedFile = createNewFile();
                        }
                    }}
                >
                    New drawing
                </li>
            </ul>

            <ul className="export">
                {['json', 'glb'].map((format) => (
                    <li
                        key={format}
                        onClick={async () =>
                            downloadjs(
                                await world.export(format as any),
                                `${normalize(appState.openedFile.name)}.${format}`,
                            )
                        }
                    >
                        Export to .{format}
                    </li>
                ))}
            </ul>
        </div>
    );
});
