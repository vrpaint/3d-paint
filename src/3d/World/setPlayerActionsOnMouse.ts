import { IFrame } from '.oldsrc/model/IAppState';
import { World } from './World';
import DrawingToolFactory from '../DrawingTools/DrawingToolFactory';
import AbstractDrawingTool from '../DrawingTools/AbstractDrawingTool';
import { babylonToCleanVector } from '../../tools/vectors';

export async function setPlayerActionsOnMouse(world: World) {
    //todo DI drawind tools
    const drawingToolFactory = new DrawingToolFactory(world);
    const drawingTool1 = await drawingToolFactory.createDrawingTool({
        color: '#ff0000',
        size: 1,
    });
    const drawingTool2 = await drawingToolFactory.createDrawingTool({
        color: '#0000ff',
        size: 1,
    });

    const drawingToolFromEvent: (
        event: { button: number },
    ) => AbstractDrawingTool = (event: { button: number }) => {
        switch (event.button) {
            case 0:
                return drawingTool1;
            case 2:
                return drawingTool2;
            default:
                return drawingTool1;
        }
    };

    const getDrawingFrame: () => IFrame = () => ({
        time: new Date().getTime() /*todo better*/,
        position: babylonToCleanVector(
            world.position.add(world.direction.scale(1.5)),
        ),
        rotation: babylonToCleanVector(
            BABYLON.Vector3.Zero() /*todo real rotation*/,
        ),
        intensity: 0.5,
    });

    /*new DrawingPoint(
        player.camera.position.add(player.direction1.scale(5)),
        BABYLON.Vector3.Zero(),
        1,
    );*/

    world.canvasElement.addEventListener('pointerdown', (event) => {
        // todo more elegant drawingToolFromEvent(event).update(getDrawingFrame());
        //console.log(`pointerdown`);
        if (event.button === 0) {
            drawingToolFromEvent(event).start();
        }
    });
    world.canvasElement.addEventListener('pointermove', (event) => {
        //todo not only on pointer move
        //console.log(`pointermove`);
        drawingToolFromEvent(event).update(getDrawingFrame());
    });
    world.canvasElement.addEventListener('pointerup', (event) => {
        //console.log(`pointerup`);
        if (event.button === 0) {
            drawingToolFromEvent(event).end();
        }
    });

    world.canvasElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        //todo this should be controlled better
        drawingToolFromEvent(event).back();
    });
}
