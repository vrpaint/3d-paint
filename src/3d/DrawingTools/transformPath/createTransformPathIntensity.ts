import { IFrame, cloneFrame } from './../../../model/IFrame';
import ITransformPath from './ITransformPath';

export default function(): ITransformPath {
    return function(frames: IFrame[]): IFrame[] {
        const newPath: IFrame[] = [];

        for (let frame of frames) {
            frame = cloneFrame(frame);
            frame.intensity = 1;
            newPath.push(frame);
        }

        return newPath;
    };
}
