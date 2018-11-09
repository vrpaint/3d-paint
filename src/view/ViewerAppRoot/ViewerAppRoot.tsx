import './ViewerAppRoot.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { IViewerAppState } from '../../model/IViewerAppState';
import { Filedrop } from '../Filedrop/Filedrop';
import { IFile } from '../../model/IFile';
import { ViewerScene } from '../ViewerScene/ViewerScene';
import { ViewerWorld } from '../../3d/World/ViewerWorld';

interface IViewerAppRootProps {
    appState: IViewerAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    world: ViewerWorld;
}

export const ViewerAppRoot = observer(
    ({ world, appState, saveState }: IViewerAppRootProps) => {
        return (
            <div className="ViewerAppRoot">
                {appState.openedFile.name}

                <ViewerScene {...{ world }} />
                <Filedrop
                    onJsonFile={(json: IFile) => {
                        appState.openedFile = json;
                        //world.loadAppState(json);
                    }}
                />
            </div>
        );
    },
);
