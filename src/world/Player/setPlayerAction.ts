import * as BABYLON from 'babylonjs';
import Player from './index';
import DrawingPoint from "../DrawingTools/DrawingPoint";
import DrawingToolFactory from "../DrawingTools/DrawingToolFactory"
import AbstractDrawingTool from "../DrawingTools/AbstractDrawingTool";


export default async function setPlayerAction(player: Player) {


    const drawingToolFactory = new DrawingToolFactory(player.world);
    //const tubeDrawingTool = await drawingToolFactory.createPathTool();
    //const brickDrawingTool = await drawingToolFactory.createPathTool();
    const drawingTool1 = await drawingToolFactory.createPathTool('DamagedConcrete');
    const drawingTool2 = await drawingToolFactory.createGridTool('Meteorite', .5);


    //alert(123);
    //let path:BABYLON.Vector3[] = [];
    //let mesh:BABYLON.Mesh|null = null;


    if (!player.world.webVR) {


        const drawingToolFromEvent: (event: { button: number }) => AbstractDrawingTool = (event: { button: number }) => {

            switch (event.button) {
                case 0:
                    return drawingTool1;
                case 2:
                    return drawingTool2;
                default:
                    return drawingTool1;
            }
        };

        const getDrawingPoint = () => new DrawingPoint(
            player.camera.position.add(player.direction1.scale(5)),
            BABYLON.Quaternion.Zero(),
            1
        );


        player.world.canvasElement.addEventListener("mousedown", (event) => {
            drawingToolFromEvent(event).update(getDrawingPoint());
            drawingToolFromEvent(event).start();
        });
        player.world.canvasElement.addEventListener("mousemove", (event) => {
            drawingToolFromEvent(event).update(getDrawingPoint());
        });
        player.world.canvasElement.addEventListener("mouseup", (event) => {
            drawingToolFromEvent(event).end();
        });

        player.world.canvasElement.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });



    } else {


        const camera = player.camera as BABYLON.WebVRFreeCamera;


        camera.onControllersAttachedObservable.add((controllers) => {


            console.log('controllers', controllers);

            controllers.forEach((controller, i) => {


                const drawingTool = i === 0 ? drawingTool1 : drawingTool2;

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