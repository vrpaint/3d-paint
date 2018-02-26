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

            const material = new BABYLON.StandardMaterial(materialName, this._scene);
            material.backFaceCulling = false;

            if (materialName.substring(0, 1) === '#') {

                const color = BABYLON.Color3.FromHexString(materialName);
                material.diffuseColor = color;
                //material.specularTexture = this.getMaterial('whiteboard').diffuseTexture;
                material.emissiveColor = color;
                material.backFaceCulling = false;

            } else {

                let textureScale = 1;
                if (materialName === 'grass') {
                    textureScale = 200;
                }
                const texture = new BABYLON.Texture(process.env.PUBLIC_URL + `/assets/textures/${materialName}.jpg`, this._scene);
                texture.uScale = textureScale;
                texture.vScale = textureScale;
                material.diffuseTexture = texture;
                material.specularColor = BABYLON.Color3.FromHexString('#ffeacb');
                material.emissiveTexture = texture;

            }


            this._materialsCache.push(material);
            return material;
        }
    }
}