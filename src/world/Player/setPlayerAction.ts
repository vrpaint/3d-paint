import * as BABYLON from 'babylonjs';
import Player from './index';
import DrawingPoint from "../DrawingTools/DrawingPoint";
import PathDrawingToolFactory from "../DrawingTools/PathDrawingToolFactory"


export default async function setPlayerAction(
    player:Player
){


    const pathDrawingToolFactory = new PathDrawingToolFactory(player.world);
    const tubeDrawingTool = await pathDrawingToolFactory.createSimpleTool();
    const brickDrawingTool = await pathDrawingToolFactory.createSimpleTool();


    //alert(123);
    //let path:BABYLON.Vector3[] = [];
    //let mesh:BABYLON.Mesh|null = null;



    if (!player.world.webVR) {

        const drawingTool = tubeDrawingTool;

        player.world.canvasElement.addEventListener("pointerdown", () => {
            drawingTool.start();
        });
        player.world.canvasElement.addEventListener("pointermove", () => {
            drawingTool.update(new DrawingPoint(
                player.camera.position.add(player.direction1.scale(5)),
                BABYLON.Quaternion.Zero(),
                1
            ));
        });
        player.world.canvasElement.addEventListener("pointerup", () => {
            drawingTool.end();
        });


    } else {


        const camera = player.camera as BABYLON.WebVRFreeCamera;


        camera.onControllersAttachedObservable.add((controllers) => {


            console.log('controllers', controllers);

            controllers.forEach((controller, i) => {


                const drawingTool = i === 0 ? tubeDrawingTool : brickDrawingTool;

                let intensity = 0;

                controller.onTriggerStateChangedObservable.add((gamepadButton) => {

                    if (gamepadButton.pressed) {
                        drawingTool.start();
                    } else {
                        drawingTool.end();
                    }

                    intensity = gamepadButton.value;

                });


                function updatePositon() {
                    drawingTool.update(new DrawingPoint(
                        controller.devicePosition,
                        controller.deviceRotationQuaternion,
                        intensity
                    ));
                    requestAnimationFrame(updatePositon);
                }

                updatePositon();



            });


            //console.log('onControllersAttachedObservable',controllers);
        });


    }
}