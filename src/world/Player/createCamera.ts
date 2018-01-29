import * as BABYLON from 'babylonjs';

export default function createCamera(scene:BABYLON.Scene):BABYLON.FreeCamera{




    setTimeout(()=>{
        var elem = document.getElementById('scene');

// Simulate clicking on the specified element.
        triggerEvent( elem, 'click' );

        /**
         * Trigger the specified event on the specified element.
         * @param  {Object} elem  the target element.
         * @param  {String} event the type of the event (e.g. 'click').
         */
        function triggerEvent( elem:any, event:any ) {
            var clickEvent = new Event( event ); // Create the event.
            elem.dispatchEvent( clickEvent );    // Dispatch the event.
        }
    },700);




    if(window.location.pathname==='/novr' || window.location.hash==='#novr') {

        //const camera = new BABYLON.FreeCamera("FreeCamera", BABYLON.Vector3.Zero(), scene);


        const camera = new BABYLON.VRDeviceOrientationFreeCamera ("Camera",  BABYLON.Vector3.Zero(), scene);

        return camera;


    }else{






        const camera = new BABYLON.WebVRFreeCamera("camera", BABYLON.Vector3.Zero(), scene);
        scene.onPointerDown = function () {
            scene.onPointerDown = function (event) {
                console.log('WebWR click event',event)
            };
            camera.attachControl(document.getElementById('scene'), true);
        };




        return camera;

    }








}