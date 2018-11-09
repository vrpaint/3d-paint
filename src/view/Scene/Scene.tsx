import './Scene.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { EditorWorld } from '../../3d/World/EditorWorld';

interface ISceneProps {
    world: EditorWorld;
}

export const Scene = observer(({ world }: ISceneProps) => {
    return (
        <div className="Scene">
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
