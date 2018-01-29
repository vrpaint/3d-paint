import {subscribeKeys,SubscriberModes} from './keys';
import * as BABYLON from 'babylonjs';
import Player from './index';
import {KEYMAP,PLAYER} from '../../config';


export default function setPlayerMovement(
    player:Player
){

    subscribeKeys(KEYMAP.FORWARD,SubscriberModes.FRAME,()=>{

        player.addMovement(new BABYLON.Vector3(PLAYER.SPEED.FORWARD,0,0));

    });
    subscribeKeys(KEYMAP.BACKWARD,SubscriberModes.FRAME,()=>{

        player.addMovement(new BABYLON.Vector3(-PLAYER.SPEED.BACKWARD,0,0));

    });
    subscribeKeys(KEYMAP.LEFT,SubscriberModes.FRAME,()=>{

        player.addMovement(new BABYLON.Vector3(0,0,PLAYER.SPEED.SIDE));

    });
    subscribeKeys(KEYMAP.RIGHT,SubscriberModes.FRAME,()=>{

        player.addMovement(new BABYLON.Vector3(0,0,-PLAYER.SPEED.SIDE));

    });

    subscribeKeys(KEYMAP.JUMP,SubscriberModes.FRAME,()=>{

        player.addMovement(new BABYLON.Vector3(0,PLAYER.SPEED.FLY,0));

    });
}