import './Menu.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { EditorWorld } from '../../3d/World/EditorWorld';
import * as downloadjs from 'downloadjs';
import { normalize } from '../../tools/normalize';
import { createNewFile } from '../../model/IFile';
import { exportWord } from '../../3d/World/exportWorld';

interface IMenuProps {
    appState: IEditorAppState & IObservableObject;
    world: EditorWorld;
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
                            world.clean(); //todo better
                            appState.openedFile = createNewFile();
                        }
                    }}
                >
                    New drawing
                </li>
            </ul>

            <ul className="export">
                {['json', 'glb', 'gltf'].map((format) => (
                    <li
                        key={format}
                        onClick={async () =>
                            downloadjs(
                                await exportWord(world, format as any),
                                `${normalize(
                                    appState.openedFile.name,
                                )}.${format}`,
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
