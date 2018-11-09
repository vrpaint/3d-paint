import './EditorScene.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { EditorWorld } from '../../3d/World/EditorWorld';

interface IEditorSceneProps {
    world: EditorWorld;
}

export const EditorScene = observer(({ world }: IEditorSceneProps) => {
    return (
        <div className="EditorScene">
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
