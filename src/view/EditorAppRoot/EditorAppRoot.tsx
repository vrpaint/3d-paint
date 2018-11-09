import './EditorAppRoot.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { Scene } from '../Scene/Scene';
import { World } from '../../3d/World/World';
import { Toolbars } from '../Toolbars/Toolbars';
import { Save } from '../Save/Save';
import { Menu } from '../Menu/Menu';
import { Filedrop } from '../Filedrop/Filedrop';

interface IEditorAppRootProps {
    appState: IEditorAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    world: World;
}

export const EditorAppRoot = observer(({ appState, saveState, world }: IEditorAppRootProps) => {
    return (
        <div className="EditorAppRoot">
            <Menu {...{ appState, world }} />
            <Toolbars {...{ world }} />
            <Scene {...{ world }} />
            <Save {...{ saveState }} />
            <Filedrop {...{ appState, world }} onJsonFile={(json: IEditorAppState)=>{

                if (
                    confirm(
                        `Do you want to replace "${
                            appState.openedFile.name
                        }" with "${json.openedFile.name}"`,
                    )
                ) {
                    world.loadAppState(json);
                }

            }} />
        </div>
    );
});
