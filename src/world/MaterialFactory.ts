import * as superagent from 'superagent';
import * as BABYLON from 'babylonjs';
import IStructure from "./IStructure";
import {isNull} from "util";
import World from './World';

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


    constructor(private world: World) {
        this._structuresCache = [];
    }


    /*getStructureSync(materialId: string): IStructure {

        const cashedMaterial = this._structuresCache.find((material) => material.id === materialId) || null;

        if (cashedMaterial) {
            return cashedMaterial;
        } else {
            console.log(`Creating structure "${materialId}".`);

            const babylonMaterial = new BABYLON.StandardMaterial(materialId, this.world.scene);
            babylonMaterial.backFaceCulling = false;//todo repair mesh builder

            let structure: IStructure = {
                id: materialId,
                babylonMaterial,
            };


            if (materialId.substring(0, 1) === '#') {

                babylonMaterial.diffuseColor = BABYLON.Color3.FromHexString(materialId);

            } else {

                throw new Error('This material can be created only in async mode.');

            }

            this._structuresCache.push(structure);
            return structure;

        }
    }*/


    async createTexture(textureId: string): Promise<BABYLON.Texture|BABYLON.Color3>{
        if(textureId.substring(0,1)==='#'){

            return BABYLON.Color3.FromHexString(textureId);

        }else
        if(textureId.substring(0,1)===':'){

            switch(textureId.substring(1)){

                case 'webcam':
                    return BABYLON.VideoTexture.CreateFromWebCam(this.world.scene,()=>{}, { maxWidth: 256, maxHeight: 256 , minWidth: 256, minHeight: 256 } as any ) as any;//why?

                case 'screenshot':

                    return await new Promise((resolve: (value: BABYLON.Texture)=>void,reject)=>{
                        BABYLON.Tools.CreateScreenshot(this.world.engine, this.world.player.camera, 200, (screenshot)=>{

                            downloadURI('screenshot.png',screenshot);
                            //console.log(screenshot);
                            resolve(new BABYLON.Texture(screenshot, this.world.scene));
    
    
                        }) 
                    });
                    

                
                    //throw new Error(`Can't create texture from textureId = "${textureId}". Unknown :special id.`);
                    //break;
                default:
                throw new Error(`Can't create texture from textureId = "${textureId}". Unknown :special id.`);
            }

            //BABYLON.VideoTexture.CreateFromWebCam(s,()=>, { maxWidth: 256, maxHeight: 256 });
        
        }else
        if(textureId.substring(0,1)==='/'){
            
            throw new Error(`Can't create texture from textureId = "${textureId}". Urls not implemented yet.`);

        }else{
            throw new Error(`Can't create texture from textureId = "${textureId}".`);
        }
    }

    async createStructure(materialId: string): Promise<IStructure> {
    
        console.log(`Creating structure "${materialId}".`);

        const babylonMaterial = new BABYLON.StandardMaterial(materialId, this.world.scene);
        babylonMaterial.backFaceCulling = false;//todo repair mesh builder


        const colorOrTexture = await this.createTexture(materialId);

        if (colorOrTexture instanceof BABYLON.Texture)
            babylonMaterial.diffuseTexture = colorOrTexture;
        else
            babylonMaterial.diffuseColor = colorOrTexture;

        
       

        /*if(materialId.substring(0,1)==='#'){

            babylonMaterial.diffuseColor = BABYLON.Color3.FromHexString(materialId);

        }else
        if(materialId==='webcam'){

            //BABYLON.VideoTexture.CreateFromWebCam(s,()=>, { maxWidth: 256, maxHeight: 256 });
        
        }/*else {


            try {
                const result = await superagent.get(process.env.PUBLIC_URL + `/assets/materials/${materialId}/material.json`);
                const structureConfig = JSON.parse(result.text);
                //console.log(structureConfig);

                const root = process.env.PUBLIC_URL + `/assets/materials/${materialId}/`;
                const defaultTexture = parseTextureConfig(structureConfig.textures.default, root, this.world.scene, null);

                if ('textures' in structureConfig) {
                    for (const textureType of ['ambient', 'diffuse', 'specular', 'emissive', 'bump']) {
                        if (textureType in structureConfig.textures) {


                            
                            const colorOrTexture = parseTextureConfig(structureConfig.textures[textureType], root, this.world.scene, defaultTexture);
                            if (colorOrTexture instanceof BABYLON.Color3) {
                                structure.babylonMaterial[textureType + 'Color'] = colorOrTexture;
                            } else if (colorOrTexture instanceof BABYLON.Texture) {
                                structure.babylonMaterial[textureType + 'Texture'] = colorOrTexture;
                            }
                        }
                    }
                }

            } catch (error) {
                console.warn(error);
                throw new Error(`Problem of config in material "${materialId}". See more in console.`);
            }

        }*/

        return {
            id: materialId,
            babylonMaterial,
            /*physicsOptions: Object.assign({},DEFAULT_PHYSICS_OPTIONS)*/
        };
    }



    async getStructure(materialId: string): Promise<IStructure> {

        const cashedMaterial:IStructure|null = null;//this._structuresCache.find((material) => material.id === materialId) || null;

        if (cashedMaterial) {
            return cashedMaterial;
        } else {
            const structure = await this.createStructure(materialId);
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


//to tools
function downloadURI(name:string, dataUri:string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = dataUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
}