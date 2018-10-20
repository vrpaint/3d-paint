import './Wall.css';
import * as TC from 'touchcontroller';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { ISituationState } from '../../model/ISituationState';
import { CanvasParticlesRenderer as WallRenderer } from 'touchcontroller';
import { drawOnWallSituationStateControllers } from '../../wall/drawOnWallSituationStateControllers';

interface IWallProps {
    appState: IAppState & IObservableObject;
    situationState: ISituationState & IObservableObject;
    wallRenderer: WallRenderer;
}

//todo hide when appState.corners calibration in process

export const Wall = observer(({ appState, situationState,wallRenderer }: IWallProps) => {
    console.log(`@Rendering Wall (this should occur only once)(!!! test and remove).`);//todo test and remove
    return (
        <div className="Wall">
            {situationState.world && situationState.world.wallMesh ? (
                <canvas
                    ref={(canvasElement) => {
                        if (canvasElement) {
                            //console.log('Canvas element for wall:', canvasElement);


                            //(window.innerWidth,window.innerHeight));//todo do sizes better
                            canvasElement.width = window.innerWidth;//canvasElement.getBoundingClientRect().width;
                            canvasElement.height = window.innerHeight;//canvasElement.getBoundingClientRect().height;

                            const ctx = canvasElement.getContext('2d')!;
                            wallRenderer.addContext(ctx);
                            //todo add wallRendererEnhancer
                            wallRenderer.subscribe(()=>{
                                drawOnWallSituationStateControllers(ctx,situationState.controllers);
                            })

                            TC;
                            /*
                        ctx.lineWidth = 10;
                        ctx.lineCap = 'round';

                        const touchController = TC.TouchController.fromCanvas(
                            canvasElement,
                        );
                        touchController.touches.subscribe(function(touch) {
                            console.log('touch', touch);

                            const color =
                                '#' +
                                Math.floor(Math.random() * 16777215).toString(
                                    16,
                                );
                            let lastFrame = touch.firstFrame;

                            touch.frames.subscribe((frame) => {
                                ctx.strokeStyle = color;
                                ctx.beginPath();
                                ctx.moveTo(
                                    lastFrame.position.x,
                                    lastFrame.position.y,
                                );
                                ctx.lineTo(frame.position.x, frame.position.y);
                                ctx.stroke();
                                lastFrame = frame;
                            });
                        });
                        */
                        }
                    }}
                />
            ) : (
                <div>Pending</div>
            )}
        </div>
    );
});
