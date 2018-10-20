import { IDrawing } from './../model/IAppState';

export function drawOnWallAppStateDrawing(
    ctx: CanvasRenderingContext2D,
    drawings: IDrawing[],
) {
    for (const drawing of drawings) {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.beginPath();
        let firstPoint = true;
        for (const frame of drawing.frames) {
            if (frame.positionOnSquare) {
                (firstPoint ? ctx.moveTo : ctx.lineTo).call(
                    ctx,
                    frame.positionOnSquare.x * ctx.canvas.width, //todo ratio
                    frame.positionOnSquare.y * ctx.canvas.height,
                );
                firstPoint = false;
            }
            //console.log(point.x,point.y,point.z,wallVector);
        }

        ctx.strokeStyle = drawing.drawingTool.color;
        ctx.lineWidth = drawing.drawingTool.size;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}
