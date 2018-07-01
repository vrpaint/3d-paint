import * as BABYLON from 'babylonjs';
//import 'babylonjs-post-process';
import {Key} from 'ts-keycode-enum';
import World from "../World";

export default function createCamera(world: World): BABYLON.FreeCamera | BABYLON.WebVRFreeCamera {

    const scene = world.scene;


    setTimeout(() => {
        var elem = document.getElementById('scene');

// Simulate clicking on the specified element.
        triggerEvent(elem, 'click');

        /**
         * Trigger the specified event on the specified element.
         * @param  {Object} elem  the target element.
         * @param  {String} event the type of the event (e.g. 'click').
         */
        function triggerEvent(elem: any, event: any) {
            var clickEvent = new Event(event); // Create the event.
            elem.dispatchEvent(clickEvent);    // Dispatch the event.
        }
    }, 700);


    if (!world.webVR) {

        //const camera = new BABYLON.VRDeviceOrientationFreeCamera ("Camera",  BABYLON.Vector3.Zero(), scene);
        const camera = new BABYLON.FreeCamera("FreeCamera", BABYLON.Vector3.Zero(), scene);
        camera.attachControl(document.getElementById('scene'), true);


        camera.keysUp = [Key.W, Key.UpArrow];
        camera.keysDown = [Key.S, Key.DownArrow];
        camera.keysLeft = [Key.A, Key.LeftArrow];
        camera.keysRight = [Key.D, Key.RightArrow];


        scene.registerBeforeRender(() => {

            if (camera.position.y < 2) {
                camera.position.y = 2;
            }

        });

    
        //const camera = new BABYLON.VRDeviceOrientationFreeCamera ("Camera",  BABYLON.Vector3.Zero(), scene);

        /*/
        var postProcess = new BABYLON.DigitalRainPostProcess("AsciiArt", camera, {
            font: "10px Roboto"
        });
        /**/

        
        return camera;


    } else {


        const camera = new BABYLON.WebVRFreeCamera("camera", BABYLON.Vector3.Zero(), scene);


        let vr=false;


        //todo maybe VR helper


        scene.onPointerDown = function () {


            camera.getEngine().enableVR();

            /*console.log(1);

            camera.getEngine().enableVR();
            
            //camera.attachControl(document.getElementById('scene'), true);

            setTimeout(()=>{
                
                camera.getEngine().disableVR();
                console.log(2);
            },2000);*/


        };

        


        /* setInterval(()=>{
             console.log('camera.leftController',camera.leftController);
         },1000);






         (camera as any).onControllersAttached = function(controllers: any) {
             console.log(controllers);
         }*/


        return camera;

    }


}