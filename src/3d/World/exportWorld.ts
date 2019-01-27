import { IWorld } from './IWorld';

async function exportWord(world: IWorld, format: 'json' | 'glb'): Promise<Blob | string> {
    //console.groupCollapsed('Exporting');
    switch (format) {
        case 'json':
            return JSON.stringify(world.openedFile, null, 4);
        case 'glb':
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

            const glb = await BABYLON.GLTF2Export.GLBAsync(
                world.scene,
                'model',
                options,
            );
            return glb.glTFFiles['model.glb' /*todo via keys*/];
    }
}