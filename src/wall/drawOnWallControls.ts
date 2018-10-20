import { drawCircle } from './drawCircle';

export function drawOnWallControls(ctx: CanvasRenderingContext2D) {
    drawCircle(
        ctx,
        {
            x: ctx.canvas.width + 50,
            y: ctx.canvas.height,
        },
        10,
        'blue',
    );
}
