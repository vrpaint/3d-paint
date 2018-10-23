import PathDrawingTool from './drawingTools/PathDrawingTool';
import { World } from '../World/World';
import ITranformPath from './transformPath/ITransformPath';
import GridDrawingTool from './drawingTools/GridDrawingTool';
import { IFrame } from '../../model/IFrame';
import AbstractDrawingTool from './AbstractDrawingTool';
import { IDrawingTool } from '../../model/IDrawingTool';

//todo to separate file to tools
function compose<T>(...funcs: ((input: T) => T)[]): (input: T) => T {
    return (input: T) => funcs.reduce((input, func) => func(input), input);
}

export default class {
    constructor(private world: World) {}

    async createDrawingTool(config: IDrawingTool): Promise<AbstractDrawingTool>{
        const transformPath: ITranformPath = compose();
        //todo createGridTool
        //createTransformPathGrid(1),
        //createTransformPathIntensity()

        return this.spyOnTool(new PathDrawingTool(this.world, {
            transformPath,
            //modifySurfacePoint: (point: BABYLON.Vector3, center: IFrame, tool: PathDrawingTool) => point,
            tessalationInLength: 0.02,
            tessalationInRadius: 7,
            countFrameRadius: (center: IFrame) => center.intensity / 40 + 0.01,
            material: (await this.world.materialFactory.getStructure(
                config.color,
            )).babylonMaterial,
        }),config);
    }

    //todo maybe as decorator
    private spyOnTool(drawingTool:AbstractDrawingTool,drawingToolConfig:IDrawingTool/*todo better naming*/):AbstractDrawingTool{

        /*
        todo
        this.world.appState.drawings.push(
            {
                id: 'abc',
                frames: [],
                drawingTool: drawingToolConfig
            }
        );
        */

        const startInner = drawingTool.start;
        drawingTool.start = ()=>{
            console.log('start spy');
            startInner.call(drawingTool);
        }

        const endInner = drawingTool.end;
        drawingTool.end = ()=>{
            console.log('end spy');
            endInner.call(drawingTool);


            
        }

        const updateInner = drawingTool.update;
        drawingTool.update = (frame: IFrame)=>{
            if(drawingTool.drawing){
                console.log('update spy');
            }
            updateInner.call(drawingTool,frame);
        }

        const backInner = drawingTool.back;
        drawingTool.back = ()=>{
            console.log('back spy');
            backInner.call(drawingTool);
        }

        return drawingTool;
    }

}


