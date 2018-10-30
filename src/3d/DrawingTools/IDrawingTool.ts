import { IFrame } from '../../model/IFrame';
import * as BABYLON from 'babylonjs';

//todo drawing tool mesh and help - maybe needed systemMode and destructor
export interface IDrawingTool<TOptions>{
    options: TOptions;
    start: () => void;
    update: (frame: IFrame) => void;
    end: () => BABYLON.Mesh[];
}