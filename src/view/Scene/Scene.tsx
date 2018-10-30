import './Scene.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { World } from '../../3d/World/World';

interface ISceneProps {
    world: World;
}

export const Scene = observer(
    ({ world }: ISceneProps) => {
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
    },
);
