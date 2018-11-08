import * as BABYLON from 'babylonjs';

export const CONTROLLER_SPRAY_DIRECTION = new BABYLON.Vector3(0, -1, 0);

export const TOOL_PATH_SIZES: number[] = [];
for (let i = 0; i < 8; i++) {
    TOOL_PATH_SIZES.push(1 / Math.pow(1.6, i + 4));
}
export const TOOL_STRUCTURES: string[] = [
    '#03A1DA',
    '#86BF28',
    '#CEDA07',
    '#F3B129',
    '#F12522',

    /*'#233656',
    '#415B76',
    '#7B9BA6',
    '#CDD6D5',
    '#EEF4F2',

    '#F8B195',
    '#F67280',
    '#C06C84',
    '#6C5B7B',
    '#355C7D',
    */
];
