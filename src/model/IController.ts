import { IDrawingTool } from './IDrawingTool';
import { IFrame } from './IAppState';

export type TWheelChangingOptions = 'SIZE'|'COLOR_HUE'|'COLOR_SATURATION'|'COLOR_LIGHT';
export const WHEEL_CHANGING_OPTIONS:TWheelChangingOptions[]  = ['SIZE','COLOR_HUE'/*,'COLOR_SATURATION','COLOR_LIGHT'*/];

export interface IController {
    id: string;
    wheelChanging: TWheelChangingOptions;
    drawingTool: IDrawingTool;
    currentFrame: null | IFrame;
}

