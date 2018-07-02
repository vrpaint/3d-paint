import * as BABYLON from 'babylonjs';

export default function setPlayerMouseLock(
    canvasElement: HTMLCanvasElement,
    camera: BABYLON.FreeCamera,
) {
    if (
        window.location.pathname === '/novr' ||
        window.location.hash === '#novr'
    ) {
        //todo add event listener
        canvasElement.addEventListener(
            'pointerdown',
            (event) => {
                if (document.pointerLockElement !== canvasElement) {
                    canvasElement.requestPointerLock();
                }
            },
            false,
        );
    }

    //todo prevent spell creating when locking cursor
    if ('onpointerlockchange' in document) {
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
    } else if ('onmozpointerlockchange' in document) {
        document.addEventListener(
            'mozpointerlockchange',
            lockChangeAlert,
            false,
        );
    }

    function lockChangeAlert() {
        if (document.pointerLockElement === canvasElement) {
            console.log('locked');
            document.addEventListener('pointermove', mouseMoveLocked, false);
        } else {
            console.log('unlocked');
            document.removeEventListener('mointermove', mouseMoveLocked, false);
        }
    }

    //todo to config
    const cameraRotationAlphaLimitMin = Math.PI * -0.5 * 0.9;
    const cameraRotationAlphaLimitMax = Math.PI * 0.5 * 0.9;

    function mouseMoveLocked(event: PointerEvent) {
        //console.log('moving');
        if (document.pointerLockElement !== canvasElement) {
            return;
        }

        const x = event.movementX;
        const y = event.movementY;
        let alpha = y / 1500;
        let beta = x / 1500;

        if (alpha < cameraRotationAlphaLimitMin)
            alpha = cameraRotationAlphaLimitMin;
        if (alpha > cameraRotationAlphaLimitMax)
            alpha = cameraRotationAlphaLimitMax;
        alpha;
        beta;

        camera.cameraRotation.x += alpha;
        camera.cameraRotation.y += beta;
    }
    mouseMoveLocked;
}
