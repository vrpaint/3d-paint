import { ISituationState } from './ISituationState';

export function createDefaultSituationState(): ISituationState {
    return {
        controllers: [],
        world: null,
    };
}
