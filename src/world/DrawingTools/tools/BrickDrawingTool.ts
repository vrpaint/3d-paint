import * as BABYLON from "babylonjs";
import AbstractLineDrawingTool from "../AbstractLineDrawingTool";

export default class BrickDrawingTool extends AbstractLineDrawingTool {


    public createDrawingMesh(): BABYLON.Mesh {

        const mesh = BABYLON.MeshBuilder.CreateTube(
            "tube" + Math.random(),
            {
                path: [this.drawingPointA.position, this.drawingPointB.position],
                radius: .05,
            },
            this.world.scene
        );
        mesh.material = this.world.materialFactory.getMaterial('grass');

        return mesh;
    }


}