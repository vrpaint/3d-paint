import './ViewerAppRoot.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { IViewerAppState } from '../../model/IViewerAppState';
import { Filedrop } from '../Filedrop/Filedrop';
import { IFile } from '../../model/IFile';

interface IViewerAppRootProps {
    appState: IViewerAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
}

export const ViewerAppRoot = observer(
    ({ appState, saveState }: IViewerAppRootProps) => {
        return (
            <div className="ViewerAppRoot">
                {appState.openedFile
                    ? appState.openedFile.name
                    : `No opened file.`}

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
