export interface IVector2 {
    x: number;
    y: number;
}

export interface IVector3 extends IVector2 {
    z: number;
}

export type IVector = IVector2 | IVector3;
