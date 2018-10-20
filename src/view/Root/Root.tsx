import './Root.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Message } from '../Message/Message';
import { IAppState } from '../../model/IAppState';
import { IObservableObject } from 'mobx';
import { ISaveState } from '../../controller/saver/ISaveState';
import { Scene } from '../Scene/Scene';
import { Wall } from '../Wall/Wall';
import { ISituationState } from '../../model/ISituationState';
import { CanvasParticlesRenderer as WallRenderer } from 'touchcontroller';

interface IAppProps {
    appState: IAppState & IObservableObject;
    saveState: ISaveState & IObservableObject;
    situationState: ISituationState & IObservableObject;
    wallRenderer: WallRenderer;
}

export const Root = observer(
    ({ appState, saveState, situationState, wallRenderer }: IAppProps) => {
        return (
            <div className="Root">
                <Message {...{ appState }} />

                {saveState.saved && (
                    <div>Saved at {saveState.saved.toString()}</div>
                )}

                <div>
                    Controllers:
                    {situationState.controllers.map((controller) => (
                        <div className="Controller" key={controller.id}>
                            <div className="field">
                                <label>Size:</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={controller.drawingTool.size}
                                    onChange={(e) =>
                                        (controller.drawingTool.size = parseInt(
                                            e.target.value,
                                        ))
                                    }
                                />
                            </div>
                            <div className="field">
                                <label>Color:</label>
                                <input
                                    type="color"
                                    value={controller.drawingTool.color}
                                    onChange={(e) =>
                                        (controller.drawingTool.color =
                                            e.target.value)
                                    }
                                />
                            </div>

                            {/*
                            <b>{controller.id}:</b>
                            {controller.currentFrame && (
                                <i>
                                    [
                                    {controller.currentFrame.positionInSpace.x.toFixed(
                                        2,
                                    )}
                                    ,
                                    {controller.currentFrame.positionInSpace.y.toFixed(
                                        2,
                                    )}
                                    ,
                                    {controller.currentFrame.positionInSpace.z.toFixed(
                                        2,
                                    )}
                                    ]
                                </i>
                            )}
                            */}
                        </div>
                    ))}
                </div>

                <Wall {...{ appState, situationState, wallRenderer }} />

                <div className="Tools">
                {appState.corners ? (
                    <button
                        onClick={() => {
                            appState.corners = null;
                            //appState.calibrationProgress = [];
                        }}
                    >
                        ReCalibrate
                    </button>
                ) : (
                    <div>
                        Calibrating {appState.calibrationProgress.length + 1}.
                        corner.
                    </div>
                )}

                {/*
                <div>
                    Wall contains {appState.drawings.length} drawings.
                    <button
                        onClick={() => {
                            if (confirm('Are you sure?')) {
                                appState.drawings = [];
                            }
                        }}
                    >
                        clean
                    </button>
                </div>*/}
                </div>

                <Scene {...{ appState, situationState, wallRenderer }} />
            </div>
        );
    },
);
