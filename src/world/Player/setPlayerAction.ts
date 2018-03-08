import * as BABYLON from 'babylonjs';
import Player from './index';
import DrawingPoint from "../DrawingTools/DrawingPoint";
import PathDrawingToolFactory from "../DrawingTools/PathDrawingToolFactory"


export default function setPlayerAction(
    player:Player
){


    const pathDrawingToolFactory = new PathDrawingToolFactory(player.world);
    const tubeDrawingTool = pathDrawingToolFactory.createSimpleTool();
    const brickDrawingTool = pathDrawingToolFactory.createSimpleTool();


    //let path:BABYLON.Vector3[] = [];
    //let mesh:BABYLON.Mesh|null = null;



    if (!player.world.webVR) {

        /*let painting = false;

        player.world.canvasElement.addEventListener("pointerdown", () => {
            painting=true;
        });
        player.world.canvasElement.addEventListener("pointermove", () => {
            if(painting){
                path.push(player.mesh.position.add(player.direction1.scale(10)));
                redrawMeshThrottled();
            }

        });
        player.world.canvasElement.addEventListener("pointerup", () => {
            painting = false;
            redrawMeshThrottled();
            mesh = null;
            path = [];
        });*/


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