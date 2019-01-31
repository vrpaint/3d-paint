import { IWorld } from './IWorld';

export async function exportWord(world: IWorld, format: 'json' | 'glb' | 'gltf'): Promise<Blob | string> {
    //console.groupCollapsed('Exporting');
    switch (format) {
        case 'json':
            return JSON.stringify(world.openedFile, null, 4);
        case 'glb':
        case 'gltf':
            const options = {
                shouldExportTransformNode: (
                    transformNode: BABYLON.Node,
                ) => {
                    const shouldExport = transformNode.name.includes(
                        'world-export',
                    );
                    return shouldExport;
                },
                exportWithoutWaitingForScene: false,
            };

            if(format==='glb'){

                const glb = await BABYLON.GLTF2Export.GLBAsync(
                    world.scene,
                    'model',
                    options,
                );
                return glb.glTFFiles[`model.${format}` /*todo via keys*/];

            }

            //todo DRY
            if(format==='gltf'){

                const glb = await BABYLON.GLTF2Export.GLTFAsync(
                    world.scene,
                    'model',
                    options,
                );
                return glb.glTFFiles[`model.${format}` /*todo via keys*/];

            }

            throw new Error('Nooo');
    }
}