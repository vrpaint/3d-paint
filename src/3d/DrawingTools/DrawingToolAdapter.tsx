import * as React from 'react';
import { World } from '../World/World';
import { IDrawingTool } from './IDrawingTool';
import * as BABYLON from 'babylonjs';
import { IDrawing } from '../../model/IDrawing';
import { IFrame } from '../../model/IFrame';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';
import PathDrawingTool from './drawingTools/PathDrawingTool';
import './DrawingToolAdapter.css';

export class DrawingToolAdapter implements IDrawingTool<any> {
    //todo TOptions is it needed?

    private drawingTool: IDrawingTool<any>;

    constructor(
        private world: World,
        private drawingToolConfig: IDrawingToolConfig<any>,
    ) {
        //todo create tool here with config
        //todo other tools

        this.drawingTool = new PathDrawingTool(
            world,
            drawingToolConfig.structureId,
            drawingToolConfig.options as any,
        ) as any;
    }

    get options(): any {
        return this.drawingTool.options;
    }
    set options(options: any) {
        this.drawingTool.options = options;
    }

    get structureId(): string {
        return this.drawingTool.structureId;
    }
    set structureId(structureId: string) {
        this.drawingTool.structureId = structureId;
    }

    private currentDrawing: null | IDrawing<any> = null;

    start() {
        //console.log('start spy');
        if (this.currentDrawing) {
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
        } else {
            console.warn(`There is no started drawing to end.`);
            return [];
        }
    }

    back() {
        //console.log('back spy');
        //todo implement
    }

    public toolbarElement: HTMLDivElement | null = null;
    renderToolbar() {
        return (
            <div
                className="DrawingToolAdapterToolbar"
                ref={(element) => {
                    if (element) this.toolbarElement = element;
                }}
            >
                {this.drawingTool.renderToolbar()}
            </div>
        );
    }

    async replayState(drawing: IDrawing<any>) {
        //for (const drawing of this.world.appState.drawings) {

        this.drawingTool.start();
        for (const frame of drawing.frames) {
            this.drawingTool.update(frame);
        }
        this.drawingTool.end();
        //}
    }
}
