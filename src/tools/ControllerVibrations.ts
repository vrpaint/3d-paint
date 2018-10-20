//todo as separate util lib
import * as BABYLON from 'babylonjs';

export class ControllerVibrations {
    constructor(
        public controller: BABYLON.WebVRController,
        private _intensity: number = 0.5,
        public duration = 1000 * 60 * 60,
    ) {}

    private _vibrating: boolean = false;

    set intensity(value: number) {
        this._intensity = value;
        this.vibrating = this.vibrating; //hack to apply the change
    }
    get intensity(): number {
        return this._intensity;
    }

    set vibrating(vibrating: boolean) {
        if (vibrating) {
            this.start();
        } else {
            this.stop();
        }
    }
    get vibrating(): boolean {
        return this._vibrating;
    }

    start() {
        this._vibrating = true;
        this.controller.browserGamepad.hapticActuators.forEach(
            (hapticActuator: any) =>
                hapticActuator.pulse(this.intensity, this.duration), //todo as type use GamepadHapticActuator
        );
    }

    stop() {
        this._vibrating = false;
        this.controller.browserGamepad.hapticActuators.forEach(
            (hapticActuator: any) => hapticActuator.pulse(0, 1), //todo as type use GamepadHapticActuator
        );
    }
}
