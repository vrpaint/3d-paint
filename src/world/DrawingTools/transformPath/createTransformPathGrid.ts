import DrawingPoint from "../DrawingPoint";
import ITranformPath from "./ITranformPath";

export default function (cellSize: number): ITranformPath {
    return function (path: DrawingPoint[]): DrawingPoint[] {

        const newPath: DrawingPoint[] = [];

        for (let point of path) {
            point = point.clone();
            point.position.x = Math.round(point.position.x / cellSize) / cellSize;
            point.position.y = Math.round(point.position.y / cellSize) / cellSize;
            point.position.z = Math.round(point.position.z / cellSize) / cellSize;
            newPath.push(point);


        }
        return newPath;
    }
}