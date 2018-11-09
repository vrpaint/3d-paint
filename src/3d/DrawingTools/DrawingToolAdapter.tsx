import * as React from 'react';
import { EditorWorld } from '../World/EditorWorld';
import { IDrawingTool } from './IDrawingTool';
import * as BABYLON from 'babylonjs';
import { IDrawing } from '../../model/IDrawing';
import { IFrame } from '../../model/IFrame';
import { v4 as uuidV4 } from 'uuid';
import { IDrawingToolConfig } from '../../model/IDrawingToolConfig';
import { PathDrawingTool } from './drawingTools/PathDrawingTool';
import './DrawingToolAdapter.css';
import { TOOL_STRUCTURES } from '../../config';
import { IWorld } from '../World/IWorld';

export class DrawingToolAdapter implements IDrawingTool<any> {
    //todo TOptions is it needed?

    private drawingTool: IDrawingTool<any>;

    constructor(
        private world: IWorld,
        drawingToolConfig: IDrawingToolConfig<any>,
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

    get config() {
        return this.drawingTool.config;
    }

    private currentDrawing: null | IDrawing<any> = null;

    start() {
        //console.log('start spy');
        if (this.currentDrawing) {
            //console.warn(`Drawing should be ended before starting new.`);
            return;
        }
        this.currentDrawing = {
            id: uuidV4(),
            frames: [],
            drawingToolConfig: this.config,
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

        //todo is it needed?
        if (this.currentDrawing && this.currentDrawing.frames.length > 50) {
            console.log(`Splitting into more chunks.`);
            this.end();
            this.start();
            this.update(frame);
        }
    }

    //private drawedIds: string[] = [];
    end(): BABYLON.Mesh[] {
        if (this.currentDrawing /*todo or drawingTool.drawing*/) {
            //console.log('drawed',JSON.parse(JSON.stringify(this.currentDrawing)));
            //console.log('end spy');
            this.world.openedFile.drawings.push(
                JSON.parse(JSON.stringify(this.currentDrawing)),
            ); //todo better
            //this.drawedIds.push(this.currentDrawing.id);

            const createdMeshes = this.drawingTool.end();

            this.world.drawingsMeshes.push({
                id: this.currentDrawing.id,
                meshes: createdMeshes,
            });

            this.currentDrawing = null;
            return createdMeshes;
        } else {
            //console.warn(`There is no started drawing to end.`);
            return [];
        }
    }

    //todo implement
    back() {
        /*
        console.log('back spy');
        const lastId = this.drawedIds.pop();
        if(lastId){
            console.log(`Undo ${lastId}.`);
            this.world.appState.drawings = this.world.appState.drawings.filter((drawing)=>drawing.id!==lastId);
        }else{
            console.log(`There is nothing to undo.`);
        }*/
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
                <div className="field color">
                    {TOOL_STRUCTURES.map((color) => (
                        <div
                            key={color}
                            style={{
                                display: 'inline-block',
                                width: 40,
                                height: 40,
                                backgroundColor: color,
                                border: `5px solid ${
                                    color === this.structureId ? 'black' : color
                                }`,
                            }}
                            onClick={() => (this.structureId = color)}
                        />
                    ))}
                </div>

                {this.drawingTool.renderToolbar()}
            </div>
        );
    }

    async replayState(drawing: IDrawing<any>) {
        //for (const drawing of this.world.appState.drawings) {
        //console.log('replayState',drawing.drawingToolConfig.structureId);

        this.drawingTool.start();
        for (const frame of drawing.frames) {
            this.drawingTool.update(frame);
        }

        this.world.drawingsMeshes.push({
            id: drawing.id,
            meshes: this.drawingTool.end(),
        });

        //}
    }

    dispose() {
        this.drawingTool.dispose();
        //todo is it all?
    }
}
