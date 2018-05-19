import * as BABYLON from 'babylonjs';
import Player from './index';
import DrawingPoint from "../DrawingTools/DrawingPoint";
import DrawingToolFactory from "../DrawingTools/DrawingToolFactory"
import AbstractDrawingTool from "../DrawingTools/AbstractDrawingTool";


export default async function setPlayerAction(player: Player) {


    const drawingToolFactory = new DrawingToolFactory(player.world);
    //const tubeDrawingTool = await drawingToolFactory.createPathTool();
    //const brickDrawingTool = await drawingToolFactory.createPathTool();
    const drawingTool1 = await drawingToolFactory.createPathTool('#ff0000');
    const drawingTool2 = await drawingToolFactory.createPathTool('#0000ff');
    //const drawingTool2 = await drawingToolFactory.createGridTool('stone-bricks', .2);

    //todo remove
    drawingTool1.setMaterial(player.world.materialFactory.getStructureSync('#ff0000').babylonMaterial);
    drawingTool2.setMaterial(player.world.materialFactory.getStructureSync('#0000ff').babylonMaterial);


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
            BABYLON.Vector3.Zero(),
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



                /*player.world.scene.registerBeforeRender(()=>{

                    if(player.world.scene.meshes.some((mesh)=>mesh.intersectsPoint(controller.devicePosition))){
                        controller.browserGamepad.hapticActuators.forEach((hapticActuator: any)=>hapticActuator.pulse(1,10));//todo as type use GamepadHapticActuator
                    }
                });*/



                //const drawingTool = i === 0 ? drawingTool1 : drawingTool2;
                const drawingTool = i === 0 ? drawingTool1 : drawingTool2;

                let intensity = 0;


                controller.onPadValuesChangedObservable.add((gamepadButton) => {


                    const h = (Math.atan2(gamepadButton.y, gamepadButton.x) / (Math.PI * 2) + 1) % 1;
                    const s = 1;
                    const l = 0.5;

                    //console.log(h);


                    const [r, g, b] = hslToRgb(h, s, l);


                    if (h === 0) return;
                    //console.log('[h, s, l]',[h, s, l]);
                    //console.log('[r, g, b]',[r, g, b]);

                    const hex = rgbToHex(r, g, b);

                    drawingTool.setMaterial(player.world.materialFactory.getStructureSync(hex).babylonMaterial);

                    /*drawingTool

                    gamepadButton.x
                    gamepadButton.y*/


                });


                /*controller.onTriggerStateChangedObservable.add((gamepadButton) => {
                    console.log('onTriggerStateChangedObservable',gamepadButton);
                });


                controller.onSecondaryButtonStateChangedObservable.add((gamepadButton) => {
                    console.log('onSecondaryButtonStateChangedObservable',gamepadButton);
                });


                controller.onPadStateChangedObservable.add((gamepadButton) => {
                    console.log('onPadStateChangedObservable',gamepadButton);
                });

                controller.onPadValuesChangedObservable.add((gamepadButton) => {
                    console.log('onPadStateChangedObservable',gamepadButton);
                });*/

                let vibrationIntensity = 0;
                setInterval(()=>{
                    if(vibrationIntensity){
                        controller.browserGamepad.hapticActuators.forEach((hapticActuator: any)=>hapticActuator.pulse(intensity,10));//todo as type use GamepadHapticActuator
                    }   
                },10);

                controller.onTriggerStateChangedObservable.add((gamepadButton) => {

                    if (gamepadButton.pressed) {
                        setTimeout(()=>{
                            drawingTool.start();
                        },50);
                        
                    } else {
                        drawingTool.end();
                    }

                    intensity = gamepadButton.value;
                    vibrationIntensity = intensity;

        

                });


                


                function updatePositon() {

                    if(typeof controller.mesh !=='undefined'){

                        drawingTool.update(new DrawingPoint(
                            controller.devicePosition,
                            controller.deviceRotationQuaternion.toEulerAngles(),
                            intensity
                        ));
                    }
                    requestAnimationFrame(updatePositon);
                }

                updatePositon();


            });


            //console.log('onControllersAttachedObservable',controllers);
        });


    }
}


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}