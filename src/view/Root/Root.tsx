import './Root.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { Scene } from '../Scene/Scene';
import { World } from '../../3d/World/World';
import { Toolbars } from '../Toolbars/Toolbars';
import { Save } from '../Save/Save';
import { Menu } from '../Menu/Menu';

interface IAppProps {
    appState: IAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    world: World;
}

export const Root = observer(({ appState, saveState, world }: IAppProps) => {
    return (
        <div className="Root">
            <Menu {...{ appState, world }} />
            <Toolbars {...{ world }} />
            <Scene {...{ world }} />
            <Save {...{ saveState }} />
        </div>
    );
});
