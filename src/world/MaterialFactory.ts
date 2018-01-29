import * as BABYLON from 'babylonjs';

export default class MaterialFactory{

    private _materialsCache:BABYLON.StandardMaterial[];

    constructor(
        private _scene:BABYLON.Scene
    ){
        this._materialsCache = [];
    }

    getMaterial(
        materialName:string
    ){

        const cashedMaterial = this._materialsCache.find((material)=>material.name === materialName)||null;

        if(cashedMaterial){
            return cashedMaterial;
        }else {

            let textureScale=1;
            if(materialName==='grass'){
                textureScale=100;
            }

            const material = new BABYLON.StandardMaterial(materialName, this._scene);
            const texture = new BABYLON.Texture(`./assets/textures/${materialName}.jpg`, this._scene);
            material.backFaceCulling = false;
            texture.uScale = textureScale;
            texture.vScale = textureScale;
            material.diffuseTexture = texture;
            material.specularColor = BABYLON.Color3.FromHexString('#ffeacb');
            material.emissiveTexture = texture;
            this._materialsCache.push(material);
            return material;
        }
    }
}