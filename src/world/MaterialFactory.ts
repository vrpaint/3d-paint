import * as superagent from 'superagent';
import * as BABYLON from 'babylonjs';
import IStructure from "./IStructure";
import {isNull} from "util";

//todo class Structure
/*
todo material props


textureScale
materialPhysicOptions
soundSettings

*/


//todo rename to StructuresFactory
export default class MaterialFactory {


    private _structuresCache: IStructure[];


    constructor(private _scene: BABYLON.Scene) {
        this._structuresCache = [];
    }


    getStructureSync(materialId: string): IStructure {

        const cashedMaterial = this._structuresCache.find((material) => material.id === materialId) || null;

        if (cashedMaterial) {
            return cashedMaterial;
        } else {
            console.log(`Creating structure "${materialId}".`);

            const babylonMaterial = new BABYLON.StandardMaterial(materialId, this._scene);
            babylonMaterial.backFaceCulling = false;//todo repair mesh builder

            let structure: IStructure = {
                id: materialId,
                babylonMaterial,
                /*physicsOptions: Object.assign({},DEFAULT_PHYSICS_OPTIONS)*/
            };


            if (materialId.substring(0, 1) === '#') {

                babylonMaterial.diffuseColor = BABYLON.Color3.FromHexString(materialId);

            } else {

                throw new Error('This material can be created only in async mode.');

            }

            this._structuresCache.push(structure);
            return structure;

        }
    }


    async getStructure(materialId: string): Promise<IStructure> {

        const cashedMaterial = this._structuresCache.find((material) => material.id === materialId) || null;

        if (cashedMaterial) {
            return cashedMaterial;
        } else {
            console.log(`Creating structure "${materialId}".`);

            const babylonMaterial = new BABYLON.StandardMaterial(materialId, this._scene);
            babylonMaterial.backFaceCulling = false;//todo repair mesh builder

            let structure: IStructure = {
                id: materialId,
                babylonMaterial,
                /*physicsOptions: Object.assign({},DEFAULT_PHYSICS_OPTIONS)*/
            };


            if(materialId.substring(0,1)==='#'){

                babylonMaterial.diffuseColor = BABYLON.Color3.FromHexString(materialId);

            }else {


                try {
                    const result = await superagent.get(process.env.PUBLIC_URL + `/assets/materials/${materialId}/material.json`);
                    const structureConfig = JSON.parse(result.text);
                    //console.log(structureConfig);

                    const root = process.env.PUBLIC_URL + `/assets/materials/${materialId}/`;
                    const defaultTexture = parseTextureConfig(structureConfig.textures.default, root, this._scene, null);

                    if ('textures' in structureConfig) {
                        for (const textureType of ['ambient', 'diffuse', 'specular', 'emissive', 'bump']) {
                            if (textureType in structureConfig.textures) {
                                const colorOrTexture = parseTextureConfig(structureConfig.textures[textureType], root, this._scene, defaultTexture);
                                if (colorOrTexture instanceof BABYLON.Color3) {
                                    structure.babylonMaterial[textureType + 'Color'] = colorOrTexture;
                                } else if (colorOrTexture instanceof BABYLON.Texture) {
                                    structure.babylonMaterial[textureType + 'Texture'] = colorOrTexture;
                                }
                            }
                        }
                    }


                    /*if ('physics' in structureConfig) {
                        for (const physicsOption of ['mass', 'restitution', 'friction']) {
                            structure.physicsOptions[physicsOption] = structureConfig.physics[physicsOption] || structure.physicsOptions[physicsOption];
                        }
                    }*/

                } catch (error) {
                    console.warn(error);
                    throw new Error(`Problem of config in material "${materialId}". See more in console.`);
                }

            }

            this._structuresCache.push(structure);
            return structure;

        }
    }

}


function parseTextureConfig(textureConfig: null | string | { src?: string, color?: string, uScale?: number, vScale?: number, uOffset?: number, vOffset?: number }, root: string, scene: BABYLON.Scene, defaultTexture: BABYLON.Color3 | BABYLON.Texture | null): BABYLON.Color3 | BABYLON.Texture | null {
    if (typeof textureConfig === 'string') {
        if (textureConfig === 'default') {
            return defaultTexture;
        }
        if (textureConfig.substring(0, 1) === '#') {
            textureConfig = {
                color: textureConfig
            }
        } else {
            textureConfig = {
                src: textureConfig
            }
        }
    }
    if (isNull(textureConfig)) {
        textureConfig = {};
    }
    if (typeof textureConfig === 'object') {
        if ('color' in textureConfig) {
            return BABYLON.Color3.FromHexString(textureConfig.color as string);
        } else if ('src' in textureConfig) {

            const texture = new BABYLON.Texture(root + textureConfig.src, scene);
            for (const textureParam of ['uScale', 'vScale', 'uOffset', 'vOffset']) {
                if (textureParam in textureConfig) {
                    texture[textureParam] = textureConfig[textureParam];
                }
            }

            return texture;

        }

    }

    return null;
}
