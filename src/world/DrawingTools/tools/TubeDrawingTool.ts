import AbstractPathDrawingTool from "../AbstractPathDrawingTool";
import * as BABYLON from "babylonjs";

export default class TubeDrawingTool extends AbstractPathDrawingTool {


    public createDrawingMesh(): BABYLON.Mesh {

        const mesh = BABYLON.MeshBuilder.CreateTube(
            "tube",
            {
                path: this.drawingPath.map((drawingPoint) => drawingPoint.position),
                radius: .05,
                radiusFunction: (i, distance) => this.intensityToRadius(this.drawingPath[i].intensity)
            },
            this.world.scene
        );
        mesh.material = this.world.materialFactory.getMaterial('#5effcd');

        return mesh;
    }


}