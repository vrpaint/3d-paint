import DrawingPoint from "../DrawingPoint";
import ITranformPath from "./ITranformPath";

export default function (): ITranformPath {
    return function (path: DrawingPoint[]): DrawingPoint[] {

        const newPath: DrawingPoint[] = [];

        for (let point of path) {
            point = point.clone();
            point.position.x = Math.round(point.position.x * 10) / 10;
            point.position.y = Math.round(point.position.y * 10) / 10;
            point.position.z = Math.round(point.position.z * 10) / 10;
            newPath.push(point);


        }
        return newPath;
    }
}