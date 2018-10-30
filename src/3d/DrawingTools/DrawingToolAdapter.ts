import { World } from './../World/World';
import { IObservableObject } from 'mobx';
import { IAppState } from './../../model/IAppState';
import { IDrawingTool } from './IDrawingTool';
import * as BABYLON from 'babylonjs';
import { IDrawing } from '../../model/IDrawing';
import { IFrame } from '../../model/IFrame';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';
import PathDrawingTool from './drawingTools/PathDrawingTool';

export class DrawingToolAdapter<TOptions> implements IDrawingTool<TOptions> {
    //todo TOptions is it needed?

    private drawingTool: IDrawingTool<TOptions>;

    constructor(
        private world: World,
        private drawingToolConfig: IDrawingToolConfig<TOptions>,
    ) {
        //todo create tool here with config
        //todo other tools


        this.drawingTool = new PathDrawingTool(
            world,
            drawingToolConfig.options as any,
        ) as any;


    }

    get options():TOptions{
        return this.drawingTool.options;
    }
    set options(options:TOptions){
        this.drawingTool.options =options;
    }

    private currentDrawing: null | IDrawing<TOptions> = null;

    start() {
        //console.log('start spy');
        if(this.currentDrawing){
            console.warn(`Drawing should be ended before starting new.`);
            return;
        }
        this.currentDrawing = {
            id: 'abc',
            frames: [],
            drawingToolConfig: this.drawingToolConfig,
        };
        this.drawingTool.start();
    }
    update(frame: IFrame) {
        //todo maybe save in every frame or debounce
        if (this.currentDrawing /*todo or drawingTool.drawing*/) {
            //console.log('update spy');
            this.currentDrawing.frames.push(frame);
        }
        this.drawingTool.update(frame);
    }

    end(): BABYLON.Mesh[] {
        if (this.currentDrawing /*todo or drawingTool.drawing*/) {
            //console.log('end spy');
            this.world.appState.drawings.push(this.currentDrawing);
            this.currentDrawing = null;
            return this.drawingTool.end();
        }else{
            console.warn(`There is no started drawing to end.`);
            return [];
        }
        
    }

    back() {
        //console.log('back spy');
        //todo implement
    }

    async replayState(drawing: IDrawing<TOptions>) {
        //for (const drawing of this.world.appState.drawings) {

        this.drawingTool.start();
        for (const frame of drawing.frames) {
            this.drawingTool.update(frame);
        }
        this.drawingTool.end();
        //}
    }
}
