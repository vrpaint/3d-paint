import './ViewerScene.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { ViewerWorld } from '../../3d/World/ViewerWorld';

interface IViewerSceneProps {
    world: ViewerWorld;
}

export const ViewerScene = observer(({ world }: IViewerSceneProps) => {
    return (
        <div className="ViewerScene">
            <canvas
                ref={(canvasElement) => {
                    if (canvasElement) {
                        console.log(
                            'Canvas element for 3D scene:',
                            canvasElement,
                        );
                        world.run(canvasElement);
                    }
                }}
            />
        </div>
    );
});
