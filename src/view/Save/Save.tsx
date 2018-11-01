import './Save.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';

interface ISaveProps {
    saveState: ISaveState & IObservableObject;
}

export const Save = observer(({ saveState }: ISaveProps) => {
    return (
        <div className="Save">
                {saveState.saved ? 'Saved' : 'Saving'}
        </div>
        //todo spinning wheel
    );
});
