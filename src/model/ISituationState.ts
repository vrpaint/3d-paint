import { World } from './../3d/World/World';
import { IController } from './IController';

export interface ISituationState {
    controllers: IController[];
    world: World | null;
}
