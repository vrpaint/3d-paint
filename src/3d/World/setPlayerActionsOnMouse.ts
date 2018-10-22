import { IFrame } from '.oldsrc/model/IAppState';
import { World } from "./World";
import DrawingToolFactory from "../DrawingTools/DrawingToolFactory";
import AbstractDrawingTool from "../DrawingTools/AbstractDrawingTool";
import { babylonToCleanVector } from '../../tools/vectors';

    

export async function setPlayerActionsOnMouse(world: World) {
    
    //todo DI drawind tools
    const drawingToolFactory = new DrawingToolFactory(world);
    const drawingTool1 = await drawingToolFactory.createPathTool('#ff0000');
    const drawingTool2 = await drawingToolFactory.createPathTool('#0000ff');
    

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


    const getDrawingFrame:()=>IFrame = () =>
        ({
            time: new Date().getTime()/*todo better*/,
            position: babylonToCleanVector(world.position.add(world.direction.scale(1.5))),
            rotation: babylonToCleanVector(BABYLON.Vector3.Zero()/*todo real rotation*/),
            intensity: .5
        })

    /*new DrawingPoint(
        player.camera.position.add(player.direction1.scale(5)),
        BABYLON.Vector3.Zero(),
        1,
    );*/

    world.canvasElement.addEventListener('pointerdown', (event) => {
        // todo more elegant drawingToolFromEvent(event).update(getDrawingFrame());
        console.log(`pointerdown`);
        drawingToolFromEvent(event).start();
    });
    world.canvasElement.addEventListener('pointermove', (event) => {

        //todo not only on pointer move
        console.log(`pointermove`);
        drawingToolFromEvent(event).update(getDrawingFrame());
    });
    world.canvasElement.addEventListener('pointerup', (event) => {
        console.log(`pointerup`);
        drawingToolFromEvent(event).end();
    });

    world.canvasElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

}