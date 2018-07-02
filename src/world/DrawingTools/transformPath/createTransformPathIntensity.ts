import DrawingPoint from '../DrawingPoint';
import ITranformPath from './ITranformPath';

export default function(): ITranformPath {
    return function(path: DrawingPoint[]): DrawingPoint[] {
        const newPath: DrawingPoint[] = [];

        for (let point of path) {
            point = point.clone();
            point.intensity = 1;
            newPath.push(point);
        }

        return newPath;
    };
}
