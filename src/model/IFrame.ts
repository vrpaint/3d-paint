import { IVector3 } from "./IVectors";

export interface IFrame {
    time: number;
    position: IVector3;
    rotation: IVector3;
    intensity: number;
}

export function cloneFrame(frame:IFrame):IFrame{
    return({
        time: frame.time,
        position: frame.position,
        rotation: frame.rotation,
        intensity: frame.intensity
    });
}