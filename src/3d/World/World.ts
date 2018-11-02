import { DrawingToolAdapter } from './../DrawingTools/DrawingToolAdapter';
import { DrawingToolFactory } from './../DrawingTools/DrawingToolFactory';
import { IObservableObject } from 'mobx';
import { IAppState } from './../../model/IAppState';
import { MaterialFactory } from './../MaterialFactory';
import * as BABYLON from 'babylonjs';
import 'babylonjs-serializers';
import { createScene } from './createScene';
import { createLights } from './createLights';
//import { createGround } from './createGround';
import { createSkybox } from './createSkybox';
import { setPlayerActionOnVRController } from './actions/setPlayerActionOnVRController';
import { Key } from 'ts-keycode-enum';
import { setPlayerActionsOnMouse } from './actions/setPlayerActionsOnMouse';

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
    private drawingToolFactory: DrawingToolFactory;

    constructor(public appState: IAppState & IObservableObject) {}

    public canvasElement: HTMLCanvasElement; //todo what if canvas is null?
    run(canvasElement: HTMLCanvasElement) {
        //todo prevent multiple runs
        this.canvasElement = canvasElement;
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
        //this.groundMesh = createGround(this.scene, this.materialFactory);
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

        this.drawingToolFactory = new DrawingToolFactory(this);
        this.drawingToolFactory.replayState();

        //todo make also on unload
        this.VRHelper.onControllerMeshLoadedObservable.add((controller) =>
            setPlayerActionOnVRController(controller, this),
        );

        setPlayerActionsOnMouse(this);

        this.canvasElement.addEventListener('keypress', (event) => {
            //console.log(`Pressed ${event.keyCode}.`);
            //console.log(event.target);
            event.preventDefault();
        });
    }

    public drawingTools: DrawingToolAdapter[] = [];
    getDrawingTool(deviceId: string): DrawingToolAdapter {
        //todo deviceId
        const drawingTool = this.drawingToolFactory.getDrawingTool({
            toolId: 'path',
            structureId: '#00ff00',
            options: {},
        });
        this.drawingTools.push(drawingTool);
        return drawingTool;
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

    //todo deprecated
    getNameForMesh(label?: string): string {
        return `${label}-world-export`; //todo uuid of world
    }

    //todo make public API
    public drawingsMeshes: {id:string,meshes: BABYLON.Mesh[]}[] = [];
    /*registerDrawingMeshes(id: string, meshes: BABYLON.Mesh){
        this.drawingMeshes.push({id,meshes});
    }

    getDrawingMeshes(id?:string){
        if(id){
            return 
        }else{

        }
    }*/

    async export(format: 'json'|'glb'):Promise<Blob|string> {
        
        //console.groupCollapsed('Exporting');
        switch(format){

            case 'json':
                return JSON.stringify(this.appState,null,4);
            case 'glb':
                const options = {
                    shouldExportTransformNode: (transformNode: BABYLON.Node) => {
                        const shouldExport = transformNode.name.includes(
                            'world-export',
                        );
                        return shouldExport;
                    },
                    exportWithoutWaitingForScene: false,
                };

                const glb = await BABYLON.GLTF2Export.GLBAsync(
                    this.scene,
                    'model',
                    options,
                );
                return glb.glTFFiles['model.glb' /*todo via keys*/];

        } 
    }
}
