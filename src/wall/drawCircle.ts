import { IVector2 } from '../model/IVectors';
import * as Color from 'color';

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    position: IVector2,
    size: number,
    color: string,
    //todo maybe border options
) {
    if(size<1)return;
    ctx.beginPath();
    ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

export function drawCircleStroke(
    ctx: CanvasRenderingContext2D,
    position: IVector2,
    size: number,
    lineWidth: number,
    color: string,
) {
    if(size<1)return;
    ctx.beginPath();
    ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function drawCircleHighlighted(
    ctx: CanvasRenderingContext2D,
    position: IVector2,
    size: number,
    color: string,
) {
    drawCircleStroke(ctx,position,size,6,Color(color).negate().hex().toString());
    drawCircleStroke(ctx,position,size,4,color);
}
