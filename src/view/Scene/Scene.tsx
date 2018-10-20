import './Scene.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { World } from '../../3d/World/World';
import { ISituationState } from '../../model/ISituationState';
import { CanvasParticlesRenderer as WallRenderer } from 'touchcontroller';

interface ISceneProps {
    appState: IAppState & IObservableObject;
    situationState: ISituationState & IObservableObject;
    wallRenderer: WallRenderer;
}

export const Scene = observer(
    ({ appState, situationState, wallRenderer }: ISceneProps) => {
        return (
            <div className="Scene">
                <canvas
                    ref={(canvasElement) => {
                        if (canvasElement) {
                            console.log(
                                'Canvas element for 3D scene:',
                                canvasElement,
                            );

                            situationState.world = new World(
                                canvasElement,
                                appState,
                                situationState,
                                wallRenderer,
                            );
                            situationState.world.run();
                        }
                    }}
                />
            </div>
        );
    },
);
