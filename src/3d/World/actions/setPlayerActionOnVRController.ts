import { CONTROLLER_SPRAY_DIRECTION } from './../../../config';
import { ControllerVibrations } from '../../../tools/ControllerVibrations';
import { ControlWheel } from '../../../tools/ControlWheel';
import * as uuidv4 from 'uuid/v4';
import * as BABYLON from 'babylonjs';
import { EditorWorld } from '../EditorWorld';
import * as html2canvas from 'html2canvas';
import { babylonToCleanVector } from '../../../tools/vectors';
import * as Color from 'color';

export function setPlayerActionOnVRController(
    controller: BABYLON.WebVRController,
    world: EditorWorld,
) {
    const focusOnToolbarVibrations = new ControllerVibrations(
        controller,
        0.5,
        10,
    );
    let focusOnToolbar = false;
    let toolbarToggled = false;

    const controllerId = uuidv4();
    console.log(
        `Controller with index ${
            controller.index
        } and id "${controllerId}" loaded.`,
        controller,
    );

    const drawingTool = world.getDrawingTool(controllerId);

    controller.onMainButtonStateChangedObservable.add((gamepadButton) => {
        //console.log(world.drawingsMeshes);

        for (const drawingMeshes of world.drawingsMeshes) {
            if (
                drawingMeshes.meshes.some((mesh) =>
                    mesh.intersectsPoint(controller.devicePosition),
                )
            ) {
                for (const mesh of drawingMeshes.meshes) {
                    mesh.dispose();
                }
            }
        }
    });

    let intensity = 0;

    world.scene.registerBeforeRender(() => {
        drawingTool.update({
            time: new Date().getTime() /*todo better*/,
            position: babylonToCleanVector(controller.devicePosition),
            rotation: babylonToCleanVector(
                controller.deviceRotationQuaternion.toEulerAngles(),
            ),
            intensity: intensity,
        });
    });

    controller.onTriggerStateChangedObservable.add((gamepadButton) => {
        if (!focusOnToolbar) {
            if (gamepadButton.value > 0.1) {
                drawingTool.start();
                intensity = gamepadButton.value;
            } else {
                drawingTool.end();
            }
        }
    });

    /*{
        const controlWheel = new ControlWheel();
        const controllerWheelVibrations = new ControllerVibrations(
            controller,
            0.1,
            10,
        );

        controlWheel.values.subscribe((value) => {
            controllerWheelVibrations.start();
            let hue = Color(drawingTool.options.material).hue();
            hue += value;
            drawingTool.options.color = Color(drawingTool.options.material)
                .hue(hue)
                .hex()
                .toString();
            console.log(drawingTool.options.material);
        });

        controller.onPadValuesChangedObservable.add((gamepadButton) => {
            controlWheel.impulse(gamepadButton);
        });
    }*/

    {
        //Toolbar

        const controllerToolbarMesh = BABYLON.Mesh.CreatePlane(
            'plane',
            1,
            world.scene,
        );
        //todo maybe factory for dynamic textures
        const material = new BABYLON.StandardMaterial('material', world.scene);
        material.backFaceCulling = false;
        const textureOptions = { width: 1024, height: 1024 };
        const texture = new BABYLON.DynamicTexture(
            'texture',
            textureOptions,
            world.scene,
            false,
        );
        texture.uScale = 1;
        texture.vScale = 1;
        material.diffuseColor = BABYLON.Color3.FromHexString('#000000');
        material.ambientColor = BABYLON.Color3.FromHexString('#000000');
        material.specularColor = BABYLON.Color3.FromHexString('#000000');
        material.emissiveTexture = texture;
        const ctx = texture.getContext();

        let r = true; //todo better naming
        world.scene.registerBeforeRender(async () => {
            if (drawingTool.toolbarElement && r) {
                r = false;
                const canvas = await html2canvas(drawingTool.toolbarElement);

                controllerToolbarMesh.scaling.x = canvas.width * 0.002; //todo const
                controllerToolbarMesh.scaling.y = canvas.height * 0.002; //todo const

                ctx.drawImage(
                    canvas,
                    0,
                    0,
                    textureOptions.width,
                    textureOptions.height,
                );
                texture.update();
            }
        });

        controllerToolbarMesh.material = material;

        controllerToolbarMesh.scaling.x = 0.3;
        controllerToolbarMesh.scaling.y = 0.7;
        controllerToolbarMesh.visibility = 0;
        /*controllerToolbar.rotation = new BABYLON.Vector3(
        Math.PI/2,
        0,
        0
    );
    controllerToolbar.parent = controller.mesh;
    */

        const controllerToolbarRay = new BABYLON.Ray(
            controller.devicePosition,
            BABYLON.Vector3.One(),
            100,
        );
        const controllerToolbarRayPickedMesh = BABYLON.Mesh.CreateSphere(
            'controllerToolbarRayPickedMesh',
            5,
            0.008,
            world.scene,
        );
        world.materialFactory
            .getStructure('#ff0000')
            .then(
                (structure) =>
                    (controllerToolbarRayPickedMesh.material =
                        structure.babylonMaterial),
            );

        let controllerToolbarRayLastPickingInfo: BABYLON.PickingInfo | null = null;
        controllerToolbarRayPickedMesh.visibility = 0;
        world.scene.registerBeforeRender(() => {
            if (toolbarToggled) {
                const matrix = new BABYLON.Matrix(); //todo can it be as a global const
                controller.deviceRotationQuaternion.toRotationMatrix(matrix);
                controllerToolbarRay.direction = BABYLON.Vector3.TransformCoordinates(
                    CONTROLLER_SPRAY_DIRECTION,
                    matrix,
                );
                const pickingInfo = world.scene.pickWithRay(
                    controllerToolbarRay,
                    (mesh) => mesh === controllerToolbarMesh,
                );
                if (pickingInfo) {
                    if (pickingInfo.pickedPoint) {
                        controllerToolbarRayPickedMesh.visibility = 1;
                        controllerToolbarRayPickedMesh.position =
                            pickingInfo.pickedPoint;
                        if (!focusOnToolbar) focusOnToolbarVibrations.start();
                        focusOnToolbar = true;
                        controllerToolbarRayLastPickingInfo = pickingInfo;
                    } else {
                        controllerToolbarRayPickedMesh.visibility = 0;
                        if (focusOnToolbar) focusOnToolbarVibrations.start();
                        focusOnToolbar = false;
                    }
                }
            }
        });

        controller.onSecondaryButtonStateChangedObservable.add(
            (gamepadButton) => {
                console.log(
                    'onSecondaryButtonStateChangedObservable',
                    gamepadButton,
                );
                if (gamepadButton.value) {
                    toolbarToggled = !toolbarToggled;
                    if (!toolbarToggled) {
                        focusOnToolbar = false;
                        controllerToolbarRayPickedMesh.visibility = 0;
                    }
                    controllerToolbarMesh.visibility = toolbarToggled ? 1 : 0;
                    if (controllerToolbarMesh.visibility) {
                        controllerToolbarMesh.position = controller.devicePosition.clone();

                        const matrix = new BABYLON.Matrix();
                        controller.deviceRotationQuaternion.toRotationMatrix(
                            matrix,
                        );
                        controllerToolbarMesh.position.addInPlace(
                            BABYLON.Vector3.TransformCoordinates(
                                CONTROLLER_SPRAY_DIRECTION.scale(0.1),
                                matrix,
                            ),
                        );

                        controllerToolbarMesh.rotationQuaternion = controller.deviceRotationQuaternion.clone();
                        controllerToolbarMesh.rotation.x += Math.PI / 2;
                        controllerToolbarMesh.rotation.y += Math.PI;
                    }
                }
            },
        );

        controller.onTriggerStateChangedObservable.add((gamepadButton) => {
            if (
                controllerToolbarRayLastPickingInfo &&
                focusOnToolbar &&
                gamepadButton.value === 1 &&
                drawingTool.toolbarElement
            ) {
                //controllerToolbarRayPickedMesh.position
                const boundingRect = drawingTool.toolbarElement.getBoundingClientRect();
                //const el = document.elementFromPoint(boundingRect.left+boundingRect.width/2,boundingRect.top+boundingRect.height/2);
                //console.log('Picking from toolbar',el);

                const textureCoords = controllerToolbarRayLastPickingInfo.getTextureCoordinates()!;
                textureCoords.y = 1 - textureCoords.y;

                click(
                    boundingRect.left + boundingRect.width * textureCoords.x,
                    boundingRect.top + boundingRect.height * textureCoords.y,
                );
                r = true;
            }
        });
    }
}

function click(x: number, y: number) {
    const event = document.createEvent('MouseEvent'); //todo pointer event
    const element = document.elementFromPoint(x, y);
    event.initMouseEvent(
        'click',
        true /* bubble */,
        true /* cancelable */,
        window,
        0,
        x,
        y,
        0,
        0 /* coordinates */,
        false,
        false,
        false,
        false /* modifier keys */,
        0 /*left*/,
        null,
    );
    if (element) {
        element.dispatchEvent(event);
    } //todo else
}
