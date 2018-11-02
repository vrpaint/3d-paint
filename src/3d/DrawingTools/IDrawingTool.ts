import { IDrawingToolConfig } from './../../model/IDrawingToolConfig';
import * as React from 'react';
import { IFrame } from '../../model/IFrame';
import * as BABYLON from 'babylonjs';

//todo drawing tool mesh and help - maybe needed systemMode and destructor
export interface IDrawingTool<TOptions> {
    options: TOptions; //todo is it needed?
    structureId: string; //todo is it needed?
    config: IDrawingToolConfig<TOptions>;

    start: () => void;
    update: (frame: IFrame) => void;
    end: () => BABYLON.Mesh[];
    renderToolbar: () => any; //todo
    dispose: () => void;
}
