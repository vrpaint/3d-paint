import * as BABYLON from 'babylonjs';
import Player from './index';
import Brick from '../../world/Brick';
import createParticles from './createParticles';
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


            mesh = BABYLON.MeshBuilder.CreateTube(
                "tube",
                {
                    path,
                    radius: .4
                },
                player.world.scene
            );
        }
    }


    const redrawMeshThrottled = _.throttle(redrawMesh,50);


    if(window.location.pathname==='/novr' || window.location.hash==='#novr') {

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


    }

    /*const brick = new Brick(
        player.world,
        'clay-bricks',
        {mass: 50000, restitution: 0.5},
        new BABYLON.Vector3(2, 2, 2),
        player.mesh.position.add(player.direction1.scale(10)),
        BABYLON.Vector3.Zero(),
        player.direction1.scale(100).add(new BABYLON.Vector3(0, 30, 0)),
        new BABYLON.Vector3(
            (Math.random() - .5) * Math.PI * 10,
            (Math.random() - .5) * Math.PI * 10,
            (Math.random() - .5) * Math.PI * 10
        )
    );*/




    window.addEventListener("gamepadconnected", function(e: any) {
        /*console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);*/



        console.log(e.gamepad.pose);

        //let lastPressed = false;

        let armed = false;


        function gamepadTick(){


            if(!isNull(e.gamepad.pose.linearVelocity)) {

                const velocity = new BABYLON.Vector3(
                    e.gamepad.pose.linearVelocity[0],
                    e.gamepad.pose.linearVelocity[1],
                    -e.gamepad.pose.linearVelocity[2]
                );


                if (velocity.length() > 2 && armed) {


                    console.log('velocity reached');
                    armed = false;

                    const direction = new BABYLON.Vector3(
                        velocity.x / velocity.length(),
                        velocity.y / velocity.length(),
                        velocity.z / velocity.length(),
                    );

                    const directionFlat = direction;/*new BABYLON.Vector3(
                        direction.x,
                        0,
                        direction.z
                    );*/


                    const brick = new Brick(
                        player.world,
                        'clay-bricks',
                        {mass: 5000, restitution: 0.5},
                        new BABYLON.Vector3(2, 2, 2),
                        directionFlat.scale(5).add(player.mesh.position),
                        BABYLON.Vector3.Zero(),
                        directionFlat.scale(300),//.add(new BABYLON.Vector3(0, 30, 0)),
                        new BABYLON.Vector3(
                            (Math.random() - .5) * Math.PI * 10,
                            (Math.random() - .5) * Math.PI * 10,
                            (Math.random() - .5) * Math.PI * 10
                        )
                    );

                    brick.mesh.visibility = 0;
                    const particles = createParticles(brick.mesh,{color1:'#ffd238',color2:'#00ff00'},player.world.scene);
                    setTimeout(()=>{

                        particles.stop();
                        brick.mesh.dispose();
                    },5000);


                    document.getElementById('score').innerText = (score++).toString();



                }else{
                    armed = true;
                }

            }
            requestAnimationFrame(gamepadTick);
        }
        gamepadTick();

    });


}