import { CanvasParticlesRenderer as WallRenderer } from 'touchcontroller';
import { IObservableObject } from 'mobx';
import { IAppState } from './../../model/IAppState';
import { MaterialFactory } from './../MaterialFactory';
import * as BABYLON from 'babylonjs';
import { createScene } from './createScene';
import { createLights } from './createLights';
import { createGround } from './createGround';
import { createSkybox } from './createSkybox';
import { controllerLoad } from './controllerLoad';
import { Key } from 'ts-keycode-enum';

import { ISituationState } from '../../model/ISituationState';
import { setPlayerActionsOnMouse } from './setPlayerActionsOnMouse';

export class World {
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public webVR: boolean;
    public lights: BABYLON.Light[];

    //todo maybe encapsulate meshes
    public groundMesh: BABYLON.AbstractMesh;
    public skyboxMesh: BABYLON.AbstractMesh;
    public wallMesh: null | BABYLON.AbstractMesh = null;
    //todo maybe encapsulate wall
    public wallMaterial: BABYLON.StandardMaterial;
    public wallTexture: BABYLON.DynamicTexture;

    public materialFactory: MaterialFactory;
    public VRHelper: BABYLON.VRExperienceHelper;

    constructor(
        public canvasElement: HTMLCanvasElement,
        public appState: IAppState & IObservableObject,
        public situationState: ISituationState & IObservableObject,
        public wallRenderer: WallRenderer,
    ) {}

    run() {
        this.engine = new BABYLON.Engine(this.canvasElement, true, {
            //preserveDrawingBuffer: true,
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.scene = createScene(this.engine);
        this.lights = createLights(this.scene);
        this.materialFactory = new MaterialFactory(this);
        this.groundMesh = createGround(this.scene, this.materialFactory);
        this.skyboxMesh = createSkybox(this.scene);

        //todo to separate file
        this.wallTexture = new BABYLON.DynamicTexture(
            'wallTexture',
            1024,
            this.scene,
            true,
        );
        const wallTextureContext = this.wallTexture.getContext();

        this.wallMaterial = new BABYLON.StandardMaterial(
            'wallMaterial',
            this.scene,
        );
        this.wallMaterial.emissiveTexture = this.wallTexture;
        this.wallMaterial.diffuseColor = BABYLON.Color3.FromHexString(
            '#000000',
        );
        this.wallMaterial.backFaceCulling = false;

        this.VRHelper = this.scene.createDefaultVRExperience();

        const camera = this.VRHelper.deviceOrientationCamera;
        if (camera) {
            camera.keysUp = [Key.W, Key.UpArrow];
            camera.keysDown = [Key.S, Key.DownArrow];
            camera.keysLeft = [Key.A, Key.LeftArrow];
            camera.keysRight = [Key.D, Key.RightArrow];
        } else {
            console.warn(`VRHelper.deviceOrientationCamera is null!`);
        }

        //todo it should work with only one controller
        //todo make also on unload
        this.VRHelper.onControllerMeshLoadedObservable.add((controller) =>
            controllerLoad(controller, this),
        );

        setPlayerActionsOnMouse(this);

        this.canvasElement.addEventListener('keypress', (event) => {
            //console.log(`Pressed ${event.keyCode}.`);
            //console.log(event.target);
            event.preventDefault();
        });
    }

    get position(): BABYLON.Vector3 {
        return this.VRHelper.currentVRCamera!.position;
    }

    get direction(): BABYLON.Vector3 {
        const point1 = this.position;
        const point2 = this.scene.pick(
            this.canvasElement.width / 2,
            this.canvasElement.height / 2,
            (mesh) => mesh === this.skyboxMesh,
        )!.pickedPoint!;
        return point2.subtract(point1).normalize();
    }

    //todo set controlls
    //todo create world

    dispose() {
        this.scene.dispose(); //todo is it all?
    }
}
