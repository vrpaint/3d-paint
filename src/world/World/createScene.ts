import * as BABYLON from 'babylonjs';

export default function createScene(engine: BABYLON.Engine): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);
    //const gravityVector = new BABYLON.Vector3(0, -100, 0);
    //const physicsPlugin = new BABYLON.OimoJSPlugin(20);
    //scene.enablePhysics(gravityVector, physicsPlugin);
    return scene;
}
