import DrawingPoint from '../DrawingPoint';

export default interface ITranformPath {
    (path: DrawingPoint[]): DrawingPoint[];
}
