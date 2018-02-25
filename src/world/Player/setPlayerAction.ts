import * as BABYLON from 'babylonjs';
import Player from './index';
import {isNull} from "util";
import * as _ from "lodash";


let score = 0;


export default function setPlayerAction(
    player:Player
){


    let path:BABYLON.Vector3[] = [];
    let mesh:BABYLON.Mesh|null = null;


    function redrawMesh(){
        if(path.length>1) {
            if (!isNull(mesh)) {
                mesh.dispose();
            }

            console.log(`Redrawing ${path.length} long tube.`);

            mesh = BABYLON.MeshBuilder.CreateTube(
                "tube",
                {
                    path,
                    radius: .05
                },
                player.world.scene
            );
        }
    }


    const redrawMeshThrottled = _.throttle(redrawMesh,50);


    if (!player.world.webVR) {

        let painting = false;


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
        });


    } else {


        const camera = player.camera as BABYLON.WebVRFreeCamera;


        camera.onControllersAttachedObservable.add((controllers) => {


            console.log('controllers', controllers);

            controllers.forEach((controller) => {


                const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 1, player.world.scene);


                controller.onTriggerStateChangedObservable.add((gamepadButton) => {


                    //console.log('onTriggerStateChangedObservable',gamepadButton);

                    sphere.position = controller.devicePosition;
                    sphere.scaling = BABYLON.Vector3.One().scaleInPlace(gamepadButton.value / 5 + .05);


                    if (gamepadButton.pressed) {


                        //console.log('controller.position',controller.mesh.position);

                        path.push(controller.devicePosition.clone());
                        redrawMeshThrottled();


                    } else {

                        redrawMeshThrottled();
                        mesh = null;
                        path = [];

                    }


                });


            });


            //console.log('onControllersAttachedObservable',controllers);
        });


    }
}