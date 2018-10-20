import { IController } from './../model/IController';
import { drawCircleStroke, drawCircleHighlighted } from './drawCircle';

export function drawOnWallSituationStateControllers(
    ctx: CanvasRenderingContext2D,
    controllers: IController[],
) {
    for (const controller of controllers) {
        if (
            controller.currentFrame &&
            controller.currentFrame.positionOnSquare
        ) {
            drawCircleHighlighted(
                ctx,
                {
                    x:
                        controller.currentFrame.positionOnSquare.x *
                        ctx.canvas.width, //todo ratio
                    y:
                        controller.currentFrame.positionOnSquare.y *
                        ctx.canvas.height,
                },
                controller.drawingTool.size / 2,
                controller.drawingTool.color,
            );
        }
    }
}
