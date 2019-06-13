import { IViewerAppState } from './../../model/IViewerAppState';
import { IWorld } from './IWorld';
import { IFile } from '../../model/IFile';
import { DrawingToolFactory } from '../DrawingTools/DrawingToolFactory';
import { IObservableObject } from 'mobx';
import { MaterialFactory } from '../MaterialFactory';
import * as BABYLON from 'babylonjs';
import 'babylonjs-serializers';
import { createScene } from './createScene';
import { createLights } from './createLights';
import { createSkybox } from './createSkybox';

export class ViewerWorld implements IWorld {
    public engine: BABYLON.Engine; //todo what if all this is null?
    public scene: BABYLON.Scene;
    public lights: BABYLON.Light[];

    //todo maybe encapsulate meshes
    public skyboxMesh: BABYLON.AbstractMesh;
    public materialFactory: MaterialFactory;
    public camera: BABYLON.ArcRotateCamera;
    private drawingToolFactory: DrawingToolFactory;
    public canvasElement: HTMLCanvasElement;

    constructor(public appState: IViewerAppState & IObservableObject) {}

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
        this.skyboxMesh = createSkybox(this.scene);

        this.camera = new BABYLON.ArcRotateCamera(
            'camera',
            0,
            0,
            10,
            new BABYLON.Vector3(0, 0, 0),
            this.scene,
        );
        this.camera.attachControl(canvasElement, true);

        this.drawingToolFactory = new DrawingToolFactory(this);
        this.drawingToolFactory.replayState((percent) => {
            this.appState.loading = percent;
        });
    }

    /*
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
    }*/

    get openedFile(): IFile {
        return this.appState.openedFile;
    }

    dispose() {
        this.scene.dispose(); //todo is it all?
    }

    //todo deprecated
    getNameForMesh(label?: string): string {
        return `${label}-world-export`; //todo uuid of world
    }

    //todo make public API
    public drawingsMeshes: { id: string; meshes: BABYLON.Mesh[] }[] = [];

    private clean() {
        //todo which implementation is better?
        for (const mesh of this.scene.meshes.filter((mesh) =>
            mesh.name.includes('world-export'),
        )) {
            mesh.dispose();
        }
    }

    //todo should it be here?
    loadAppState(newFile: IFile) {
        alert(1);

        this.appState.openedFile = newFile;
        this.clean();
        this.drawingToolFactory.replayState((percent) => {
            this.appState.loading = percent;
        });
    }
}
