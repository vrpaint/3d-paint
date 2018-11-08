import './ViewerAppRoot.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { IViewerAppState } from '../../model/IViewerAppState';

interface IViewerAppRootProps {
    appState: IViewerAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
}

export const ViewerAppRoot = observer(({ appState, saveState}: IViewerAppRootProps) => {
    return (
        <div className="ViewerAppRoot">
            Viewer
        </div>
    );
});
