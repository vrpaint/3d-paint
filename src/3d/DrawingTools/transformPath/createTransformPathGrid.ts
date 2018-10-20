
import ITransformPath from './ITransformPath';
import { IFrame, cloneFrame } from '../../../model/IFrame';

export default function(cellSize: number): ITransformPath {
    return function(frames: IFrame[]): IFrame[] {
        const newPath: IFrame[] = [];

        for (let frame of frames) {
            frame = cloneFrame(frame);
            frame.position.x =
                Math.round(frame.position.x / cellSize) / cellSize;
            frame.position.y =
                Math.round(frame.position.y / cellSize) / cellSize;
            frame.position.z =
                Math.round(frame.position.z / cellSize) / cellSize;
            newPath.push(frame);
        }
        return newPath;
    };
}
