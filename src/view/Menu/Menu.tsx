import './Menu.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { World } from '../../3d/World/World';
import * as downloadjs from 'downloadjs';
import { normalize } from '../../tools/normalize';

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
                            world.clean();
                            appState.drawings = [];
                        }
                    }}
                >
                    New drawing
                </li>
            </ul>

            <ul className="export">
                {['json','glb'].map((format)=>(
                    <li key={format} onClick={async () => downloadjs(await world.export(format as any),`${normalize(appState.name)}.${format}`)}>Export to .{format}</li>
                ))}

                
            </ul>
        </div>
    );
});
