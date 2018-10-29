import * as uuidv4 from 'uuid/v4';
import * as BABYLON from 'babylonjs';
import { World } from './World';
import { WHEEL_CHANGING_OPTIONS } from '../../model/IController';

export function controllerLoad(
    controller: BABYLON.WebVRController,
    world: World,
) {
    let controllerPressed = false;

    const controllerId = uuidv4();
    console.log(
        `Controller with index ${
            controller.index
        } and id "${controllerId}" loaded.`,
        controller,
    );
    world.situationState.controllers.push({
        id: controllerId,
        wheelChanging: WHEEL_CHANGING_OPTIONS[0],
        drawingToolConfig: {
            toolId: 'path',
            options: {}, //todo
        },
        currentFrame: null,
    });
    const controllerState = world.situationState.controllers.find(
        (controller) => controller.id == controllerId,
    )!; //todo maybe better name

    const controllerMeshOnSpace = BABYLON.Mesh.CreateSphere(
        'controllerMeshOnWall',
        5,
        0.03,
        world.scene,
    );
    controllerMeshOnSpace.position = controller.devicePosition;

    /*
    const controllerMeshOnWall = BABYLON.Mesh.CreateSphere(
        'controllerMeshOnWall',
        5,
        0.03,
        world.scene,
    );
    const ray = new BABYLON.Ray(
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.One(),
        100,
    );

   
    
    world.scene.registerAfterRender(() => {
        let positionOnWall: IVector3 | null = null;
        if (world.wallMesh) {
            ray.origin = controller.devicePosition;
            const matrix = new BABYLON.Matrix(); //todo can it be as a global const
            controller.deviceRotationQuaternion.toRotationMatrix(matrix);
            ray.direction = BABYLON.Vector3.TransformCoordinates(
                CONTROLLER_SPRAY_DIRECTION,
                matrix,
            );

            const hit = world.wallMesh
                .getScene()
                .pickWithRay(ray, (mesh) => mesh === world.wallMesh);
            if (hit) {
                if (hit.pickedPoint) {
                    positionOnWall = babylonToCleanVector(hit.pickedPoint);
                    controllerMeshOnWall.visibility = 1;
                    controllerMeshOnWall.position = hit.pickedPoint;
                } else {
                    positionOnWall = null;
                    controllerMeshOnWall.visibility = 0;
                }
            }
        }
        controllerState.currentFrame = {
            time: new Date().getTime(),
            position: babylonToCleanVector(controller.devicePosition),
            rotation: babylonToCleanVector(controller.deviceRotationQuaternion.toEulerAngles()),
            intensity: 0.5//todo
        };
    });

    //}
    //{

    let currentDrawing: null | IDrawing = null;

    let position1: null|TC.Vector2;
    world.scene.registerAfterRender(() => {
        if (controllerPressed) {
            //todo do not find every animation frame
            const controllerState = world.situationState.controllers.find(
                (controller) => controller.id == controllerId,
            )!;

            if (!currentDrawing) {
                const drawingId = uuidv4();
                currentDrawing = {
                    id: drawingId,
                    drawingTool: Object.assign({}, controllerState.drawingTool),
                    frames: [],
                };
                world.appState.drawings.push(currentDrawing);
                currentDrawing = world.appState.drawings.find(
                    (drawing) => drawing.id == drawingId,
                )!;
            }

            if (
                controllerState.currentFrame &&
                controllerState.currentFrame.positionOnSquare
            ) {
                //todo save drawings currentDrawing.frames.push(controllerState.currentFrame);

                
                if(controllerState.currentFrame.positionOnWall){


                    const position2 = new TC.Vector2(//todo better directly deserialize
                        controllerState.currentFrame.positionOnSquare.x*window.innerWidth,//todo better sizes
                        controllerState.currentFrame.positionOnSquare.y*window.innerHeight
                    );
                    if(!position1)position1=position2;

                    const segments = Math.ceil(position1.length(position2)/(controllerState.drawingTool.size*1));
                    
                    const positionAdd = position2.subtract(position1).scaleInPlace(1/segments);
                    const positionCurrent = position1.clone();

                    //console.log(segments,positionAdd);

                    for(let i =0;i<segments;i++){

                        const particleOptions = {
                            shapeSrc: './assets/particles/blob.png',
                            shapeCenter: new TC.Vector2(0.5, 0.5),
                            color: controllerState.drawingTool.color,
                            current: {
                                position: positionCurrent.clone(),
                                rotation: 0,
                                widthSize: controllerState.drawingTool.size*1.6,
                            }, 
                            movement: {
                                position: new TC.Vector2(
                                    (Math.random() - 0.5) * 0, //todo depend this value
                                    (Math.random() - 0.5) * 0,
                                ),
                                rotation: ((Math.random() - 0.5) * Math.PI * 2 / 3),
                                widthSize: 11,
                            },
                            friction:  0.07
                        };
                        //console.log(particleOptions);
                        world.wallRenderer.addPoint(particleOptions);
                        positionCurrent.addInPlace(positionAdd);
                    }

                    position1=position2;
                }
            } else {
                console.warn(`You do not have ray on drawing wall!`); //todo is it optimal?
                position1=null;
            }
        } else {
            currentDrawing = null;
            position1=null;
        }
    });

    controller.onTriggerStateChangedObservable.add((gamepadButton) => {
        //console.log('Trigger state changed.', gamepadButton);

        if (!world.appState.corners) {
            //---------------------------------------In calibration process
            if (gamepadButton.value === 1) {
                world.appState.calibrationProgress.push(
                    babylonToCleanVector(controller.mesh!.position),
                );

                if (world.appState.calibrationProgress.length === 4) {
                    console.log(
                        'this.appState.calibrationProgress',
                        world.appState.calibrationProgress,
                    );

                    const [
                        topLeft,
                        topRight,
                        bottomRight,
                        bottomLeft,
                    ] = world.appState.calibrationProgress;
                    world.appState.corners = {
                        topLeft,
                        topRight,
                        bottomLeft,
                        bottomRight,
                    };
                    world.appState.calibrationProgress = [];
                    world.renderWallMesh();
                }
            }

            //---------------------------------------
        } else {
            //---------------------------------------Drawing
            if (gamepadButton.value === 1) {
                controllerPressed = true;
                //controllerVibrations.start();
            } else {
                controllerPressed = false;
                //controllerVibrations.stop();
            }
            //---------------------------------------
        }
    });

    const controlWheel = new ControlWheel();
    const controllerWheelVibrations = new ControllerVibrations(
        controller,
        0.1,
        10,
    );

    controlWheel.values.subscribe((value) => {

        controllerWheelVibrations.start();
        switch(controllerState.wheelChanging){
            case 'SIZE':
                controllerState.drawingTool.size = Math.max(1,Math.min(controllerState.drawingTool.size+value,100));//todo range
                console.log( controllerState.drawingTool.size );
                break;
            case 'COLOR_HUE':
                let hue = Color(controllerState.drawingTool.color).hue();
                hue+=value;
                controllerState.drawingTool.color = Color(controllerState.drawingTool.color).hue(hue).hex().toString();
                console.log(controllerState.drawingTool.color);
                break;
            case 'COLOR_SATURATION':
                let saturaion = Color(controllerState.drawingTool.color).saturationl();
                saturaion+=value;
                controllerState.drawingTool.color = Color(controllerState.drawingTool.color).saturationl(saturaion).hex().toString();
                console.log(controllerState.drawingTool.color);
                break;
            case 'COLOR_LIGHT':
                let lightness = Color(controllerState.drawingTool.color).lightness();
                lightness+=value;
                controllerState.drawingTool.color = Color(controllerState.drawingTool.color).lightness(lightness).hex().toString();
                console.log(controllerState.drawingTool.color);
                break;
        }
        

    });

    controller.onPadValuesChangedObservable.add((gamepadButton) => {
        controlWheel.impulse(gamepadButton);
    });

    controller.onPadStateChangedObservable.add((gamepadButton) => {
        console.log('onPadStateChangedObservable',gamepadButton);
        if(gamepadButton.pressed){
            const i = WHEEL_CHANGING_OPTIONS.indexOf(controllerState.wheelChanging)
            controllerState.wheelChanging = WHEEL_CHANGING_OPTIONS[(i+1)%4];
            console.log(controllerState.wheelChanging);
            
        }
    });

    controller.onSecondaryButtonStateChangedObservable.add((gamepadButton) => {
        //todo change shape
    });

    controller.onMainButtonStateChangedObservable.add((gamepadButton) => {
        console.log('onMainButtonStateChangedObservable', gamepadButton);
        //todo undo
    });

    */
}
