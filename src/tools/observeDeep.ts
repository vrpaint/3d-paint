import { observe } from 'mobx';

export function observeDeep(observableObject: {}, changeCallback: () => void) {
    try {
        observe(observableObject, changeCallback);

        if (observableObject instanceof Array) {
            for (const observableSubobject of observableObject) {
                observeDeep(observableSubobject, changeCallback);
            }
        } else if (typeof observableObject === 'object') {
            for (const key of Object.keys(observableObject)) {
                const observableSubobject = observableObject[key];
                observeDeep(observableSubobject, changeCallback);
            }
        }
    } catch (error) {
        //todo do something or make it whole better
    }
}
