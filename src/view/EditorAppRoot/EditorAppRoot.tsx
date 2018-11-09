import './EditorAppRoot.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { EditorWorld } from '../../3d/World/EditorWorld';
import { Toolbars } from '../Toolbars/Toolbars';
import { Save } from '../Save/Save';
import { Menu } from '../Menu/Menu';
import { Filedrop } from '../Filedrop/Filedrop';
import { IFile } from '../../model/IFile';
import { EditorScene } from '../EditorScene/EditorScene';

interface IEditorAppRootProps {
    appState: IEditorAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    world: EditorWorld;
}

export const EditorAppRoot = observer(
    ({ appState, saveState, world }: IEditorAppRootProps) => {
        return (
            <div className="EditorAppRoot">
                <Menu {...{ appState, world }} />
                <Toolbars {...{ world }} />
                <EditorScene {...{ world }} />
                <Save {...{ saveState }} />
                <Filedrop
                    onJsonFile={(json: IFile) => {
                        if (
                            confirm(
                                `Do you want to replace "${
                                    appState.openedFile.name
                                }" with "${json.name}"`,
                            )
                        ) {
                            world.loadAppState(json);
                        }
                    }}
                />
            </div>
        );
    },
);
